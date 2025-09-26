import { type Request, type Response } from "express";
import { prisma, Prisma } from "database/client";

export const handleWebhook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { workflowId } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Webhook ID is missing" });
  }

  console.log(`"id":"${id}"`);

  try {
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
      },
    });

    if (!workflow) {
      return res.status(404).json({ error: "Webhook trigger not found" });
    }
    console.log(workflow);
    const workflowData = {body: {...req.body}, headers: {...req.headers}, query: {...req.query}}

    const newExecution = await prisma.execution.create({
      data: {
        workflowId: workflow.id,
        status: "PENDING",
        triggerData: (workflowData as Prisma.JsonObject) ?? {},
        nodes: workflow.nodes as Prisma.InputJsonValue,
        connections: workflow.connections as Prisma.InputJsonValue,
      },
    });

    console.log(
      `New execution created: ${newExecution.id} for workflow: ${workflow.id}`
    );

    res.status(200).json({
      message: "Webhook received and workflow execution started.",
      executionId: newExecution.id,
    });
  } catch (error) {
    console.error(`Error handling webhook for ID ${id}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};
