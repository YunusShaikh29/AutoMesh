import { prisma, Prisma } from "database/client";
import { z } from "zod";
import {
  NODE_TYPE,
  nodeSchema,
  TRIGGER_KIND,
  connectionSchema,
  ACTION_KIND,
} from "common/types";

import { decrypt } from "common/encryption";
import { executeLLM } from "./utils/langchain";
import { resolveParameters } from "./utils/interpolation";
import { sendTelegramMessage } from "./utils/telegram";
import { sendEmail } from "./utils/email";

const EXECUTION_POLLING_INTERVAL = 5000;

interface ExecutionWithWorkflow
  extends Prisma.ExecutionGetPayload<{
    include: { workflow: true };
  }> {}

export type AppNode = z.infer<typeof nodeSchema>;
type Connection = z.infer<typeof connectionSchema>;

const getCredential = async (credentialId: string, userId: string) => {
  const encryptedCredential = await prisma.credential.findUnique({
    where: {
      id: credentialId,
      userId,
    },
  });

  if (!encryptedCredential) {
    throw new Error("Credential not found.");
  }
  const decryptedCredential = decrypt(encryptedCredential.data);
  return decryptedCredential;
};

const nodeOutputs: { [nodeId: string]: any } = {};

const executeWorkflow = async (execution: ExecutionWithWorkflow) => {
  console.log(
    `Executing workflow ${execution.workflowId} (Execution ID: ${execution.id})`
  );

  const nodes = execution.nodes as AppNode[];
  const connections = execution.connections as Connection[];
  let lastNodeOutput: any = null;

  try {
    if (!nodes || nodes.length === 0) {
      throw new Error("Workflow has no nodes.");
    }

    const triggerNode = nodes.find((node) => node.type === NODE_TYPE.trigger);

    if (!triggerNode) {
      throw new Error("Workflow has no trigger node.");
    }

    //Start Execution

    let initialData: any = {};
    switch (triggerNode.kind) {
      case TRIGGER_KIND.webhook:
        initialData = {
          message: "webhook received",
          // @ts-ignore
          body: execution.triggerData?.body || {},
          // @ts-ignore
          headers: execution.triggerData?.headers || {},
        };
        // console.log("execution, webhook node", execution.triggerData)
        break;
      case TRIGGER_KIND.manual:
        initialData = { message: "manual trigger", data: {} };
        break;
      default:
        throw new Error(`Unsupported trigger kind: ${triggerNode}`);
    }
    nodeOutputs[triggerNode.id] = initialData;
    lastNodeOutput = initialData;

    await prisma.executionLog.create({
      data: {
        executionId: execution.id,
        nodeId: triggerNode.id,
        nodeName: triggerNode.name,
        status: "COMPLETED",
        outputData: initialData,
      },
    });

    const startingConnections = connections.filter(
      (conn) => conn.source === triggerNode.id
    );
    const nodesToRunNextIds = startingConnections.map((conn) => conn.target);
    let executionQueue = nodes.filter((node) =>
      nodesToRunNextIds.includes(node.id)
    );

    while (executionQueue.length > 0) {
      const currentNode = executionQueue.shift(); //get the first node
      if (!currentNode) continue;

      try {
        console.log(`Executing node: ${currentNode.name}`);

        //dynamic parameters resolving {{}}
        const resolvedParameters = resolveParameters({
          parameters: currentNode.parameters || {},
          nodeOutputs,
          nodes,
        });

        const nodeToExecute = {
          ...currentNode,
          parameters: resolvedParameters,
        };

        const connectionsToCurrentNode = connections.filter(
          (conn) => conn.target === nodeToExecute?.id
        );
        const prevNodesData = connectionsToCurrentNode.map(
          (conn) => nodeOutputs[conn.source]
        );

        let output: any = {};
        switch (nodeToExecute?.kind) {
          case ACTION_KIND.aiAgent: {
            const {
              credentialId = "",
              model: modelName = "gpt-4o-mini",
              prompt = "",
            } = nodeToExecute.parameters || {};

            const credential = await getCredential(
              credentialId,
              execution.workflow.userId
            );

            const { apiKey } = JSON.parse(credential);

            const response = await executeLLM({
              modelName,
              prompt,
              apiKey,
            });
            output = {
              output: response,
            };
            console.log("output, ai agent node", output)
            break;
          }

          case ACTION_KIND.telegram: {
            const {
              credentialId = "",
              chatId = "",
              message = "",
            } = nodeToExecute.parameters || {};

            const credential = await getCredential(
              credentialId,
              execution.workflow.userId
            );
            const { botToken } = JSON.parse(credential);

            output = await sendTelegramMessage({
              botToken,
              chatId,
              message,
            });
            console.log("output, telegram node", output);
            break;
          }

          case ACTION_KIND.email: {
            const {
              credentialId = "",
              to = "",
              subject = "",
              body = "",
            } = nodeToExecute.parameters || {};

            const credential = await getCredential(
              credentialId,
              execution.workflow.userId
            );
            const { apiKey } = JSON.parse(credential);

            output = await sendEmail({
              apiKey,
              to,
              subject,
              body,
            });
            console.log("output, email node", output);
            break;
          }

          default:
            console.warn(`Node kind ${nodeToExecute?.kind} is not supported.`);
            output = { message: "Action not supported." };
        }
        nodeOutputs[currentNode.id] = output;
        lastNodeOutput = output;

        await prisma.executionLog.create({
          data: {
            executionId: execution.id,
            nodeId: currentNode.id,
            nodeName: currentNode.name,
            status: "COMPLETED",
            inputData: prevNodesData,
            outputData: output,
          },
        });

        const connectionsFromCurrentNode = connections.filter(
          (conn) => conn.source === currentNode?.id
        );
        const nextNodeIds = connectionsFromCurrentNode.map(
          (conn) => conn.target
        );
        const nextNodes = nodes.filter((node) => nextNodeIds.includes(node.id));
        executionQueue.push(...nextNodes);
      } catch (nodeError: any) {
        await prisma.executionLog.create({
          data: {
            executionId: execution.id,
            nodeId: currentNode.id,
            nodeName: currentNode.name,
            status: "FAILED",
            error:
              nodeError.message || "An unexpected error occurred in this node.",
          },
        });
        throw nodeError;
      }
    }

    await prisma.execution.update({
      where: { id: execution.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        output: lastNodeOutput,
      },
    });
    console.log(
      `Workflow ${execution.workflowId} (Execution ID: ${execution.id}) completed successfully.`
    );
  } catch (error: any) {
    console.error(`Execution ${execution.id} failed:`, error.message);
    await prisma.execution.update({
      where: { id: execution.id },
      data: {
        status: "FAILED",
        error: error.message || "An unknown error occurred.",
        completedAt: new Date(),
      },
    });
  }
};

const pollForExecutions = async () => {
  try {
    const pendingExecutions = await prisma.execution.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        workflow: true,
      },
      orderBy: { startedAt: "asc" },
    });

    if (pendingExecutions.length > 0) {
      console.log(`Found ${pendingExecutions.length} pending executions.`);
    }

    for (const execution of pendingExecutions) {
      try {
        const updatedExecution = await prisma.execution.update({
          where: {
            id: execution.id,
            status: "PENDING",
          },
          data: {
            status: "RUNNING",
            startedAt: new Date(),
          },
        });

        if (updatedExecution) {
          console.log(
            `Claimed execution ${updatedExecution.id}. Starting workflow...`
          );
          executeWorkflow(execution);
        } else {
          console.log(
            `Execution ${execution.id} was already claimed by another worker.`
          );
        }
      } catch (error) {
        console.error(`Error claiming execution ${execution.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error polling for executions:", error);
  }
};

const main = () => {
  console.log("Executor started. Polling for pending executions...");
  pollForExecutions();
  setInterval(pollForExecutions, EXECUTION_POLLING_INTERVAL);
};

main();
