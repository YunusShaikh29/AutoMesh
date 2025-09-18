import { prisma, Prisma } from "database/client";
import { z } from "zod";
import {
  NODE_TYPE,
  nodeSchema,
  TRIGGER_KIND,
  connectionSchema,
  ACTION_KIND,
} from "common/types";

const EXECUTION_POLLING_INTERVAL = 5000;

interface ExecutionWithWorkflow
  extends Prisma.ExecutionGetPayload<{
    include: { workflow: true };
  }> {}

type AppNode = z.infer<typeof nodeSchema>;
type Connection = z.infer<typeof connectionSchema>;

const executeWorkflow = async (execution: ExecutionWithWorkflow) => {
  console.log(
    `Executing workflow ${execution.workflowId} (Execution ID: ${execution.id})`
  );

  const nodes = execution.nodes as AppNode[];
  const connections = execution.connections as Connection[];
  const nodeOutputs: { [nodeId: string]: any } = {};
  let lastNodeOutput: any = null;

  try {
    if (!nodes || nodes.length === 0) {
      throw new Error("Workflow has no nodes.");
    }

    const triggerNode = nodes.find((node) => node.type === NODE_TYPE.trigger);

    if (!triggerNode) {
      throw new Error("Workflow has no trigger node.");
    }

    // --- Start Execution ---

    let initialData: any = {};
    switch (triggerNode.kind) {
      case TRIGGER_KIND.webhook:
        initialData = { message: "webhook recieved", body: {}, headers: {} };
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
      const currentNode = executionQueue.shift();
      if (!currentNode) continue;

      try {
        console.log(`Executing node: ${currentNode.name}`);
        const connectionsToCurrentNode = connections.filter(
          (conn) => conn.target === currentNode?.id
        );
        const prevNodesData = connectionsToCurrentNode.map(
          (conn) => nodeOutputs[conn.source]
        );

        let output: any = {};
        switch (currentNode?.kind) {
          case ACTION_KIND.aiAgent:
            output = {
              result: `Ai agent processed with input: ${prevNodesData}`,
            };
            break;
          default:
            console.warn(`Node kind ${currentNode?.kind} is not supported.`);
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
