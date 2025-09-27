import { type Request, type Response } from "express";
import { prisma, Prisma } from "database/client";

export const handleWebhook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { workflowId } = req.params;
  const method = req.method;

  if (!id) {
    return res.status(400).json({ error: "Webhook ID is missing" });
  }

  console.log(`Webhook ${method} request received for ID: ${id}`);

  try {
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: workflowId,
      },
    });

    if (!workflow) {
      return res.status(404).json({ error: "Webhook trigger not found" });
    }

    const workflowData = {
      method: method,
      body: method === 'GET' ? {} : {...req.body}, 
      headers: {...req.headers},
      query: {...req.query},
      params: {...req.params},
      url: req.url,
      timestamp: new Date().toISOString()
    };

    console.log(`Processing ${method} webhook for workflow: ${workflow.id}`);

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
      `New execution created: ${newExecution.id} for workflow: ${workflow.id} via ${method} request`
    );

    const response = {
      message: `${method} webhook received and workflow execution started.`,
      executionId: newExecution.id,
      method: method,
      timestamp: new Date().toISOString()
    };

    const statusCode = method === 'GET' ? 200 : 201;
    
    res.status(statusCode).json(response);
  } catch (error) {
    console.error(`Error handling ${method} webhook for ID ${id}:`, error);
    res.status(500).json({ 
      error: "Internal server error",
      method: method,
      timestamp: new Date().toISOString()
    });
  }
};
