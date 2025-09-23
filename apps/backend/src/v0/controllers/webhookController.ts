import { type Request, type Response } from "express";
import { prisma, Prisma } from "database/client";

export const handleWebhook = async (req: Request, res: Response) => {
  const { id } = req.params; // This is the trigger node ID
  const { workflowId } = req.params; // This is the workflow ID

  if (!id) {
    return res.status(400).json({ error: "Webhook ID is missing" });
  }

  console.log(`"id":"${id}"`);

  try {
    // 1. Find the workflow that contains this specific trigger node.
    // We search for a workflow that has a node with the given ID.
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
      },
    });

    if (!workflow) {
      return res.status(404).json({ error: "Webhook trigger not found" });
    }
    console.log(workflow);
    const workflowData = {body: {...req.body}, headers: {...req.headers}}

    // 2. Create a new execution record for the executor to pick up.
    const newExecution = await prisma.execution.create({
      data: {
        workflowId: workflow.id,
        status: "PENDING",
        // Store the incoming data so the executor can use it as the trigger's output
        triggerData: (workflowData as Prisma.JsonObject) ?? {},
        // Copy the current workflow structure to this execution
        nodes: workflow.nodes as Prisma.InputJsonValue,
        connections: workflow.connections as Prisma.InputJsonValue,
      },
    });

    console.log(
      `New execution created: ${newExecution.id} for workflow: ${workflow.id}`
    );

    // 3. Respond immediately to the sender.
    res.status(200).json({
      message: "Webhook received and workflow execution started.",
      executionId: newExecution.id,
    });
  } catch (error) {
    console.error(`Error handling webhook for ID ${id}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};
