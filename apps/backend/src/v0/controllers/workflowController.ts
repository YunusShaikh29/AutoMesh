import { type NextFunction, type Response } from "express";
import { Prisma, prisma } from "database/client";
import { createWorkflowBodySchema } from "common/types";
import type { AuthRequest } from "../middlewares/isAuthenticated";
import { ZodError } from "zod";

export const createWorkflow = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const { name, description, nodes, connections } =
      createWorkflowBodySchema.parse(req.body);

    const newWorkflow = await prisma.workflow.create({
      data: {
        name,
        description,
        nodes,
        connections,
        userId,
        active: true,
      },
    });

    res.status(201).json(newWorkflow);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: "Invalid request body.",
        details: error.issues,
      });
    }

    console.error("Failed to create workflow:", error);
    res.status(500).json({
      error: "An internal error occurred while creating the workflow.",
    });
  }
};

export const getWorkflows = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }

  try {
    const workflows = await prisma.workflow.findMany({
      where: {
        userId,
      },
      select: {
        connections: true,
        nodes: true,
        name: true,
        active: true,
        description: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        webhooks: true,
      },
    });
    res.status(200).json({ workflows });
  } catch (error) {
    console.error("Failed to get workflows:", error);
    res.status(500).json({
      error: "An internal error occurred while getting the workflows.",
    });
  }
};

export const getOneWorkflow = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }

  const workflowId = req.params.id;
  if (!workflowId) {
    return res.status(400).json({ error: "Workflow ID is required" });
  }

  try {
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: workflowId,
        userId,
      },
      select: {
        connections: true,
        nodes: true,
        name: true,
        description: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }
    res.status(200).json({ workflow });
  } catch (error) {
    console.error("Failed to get workflow:", error);
    res.status(500).json({
      error: "An internal error occurred while getting the workflow.",
    });
  }
};

export const updateWorkflow = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }

  const workflowId = req.params.id;
  if (!workflowId) {
    return res.status(400).json({ error: "Workflow ID is required" });
  }

  try {
    const { name, description, nodes, connections } =
      createWorkflowBodySchema.parse(req.body);

    const updatedWorkflow = await prisma.workflow.update({
      where: { id: workflowId, userId },
      data: { name, description, nodes, connections },
    });
    if (!updatedWorkflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }
    res.status(200).json({ updatedWorkflow });
  } catch (error) {
    console.error("Failed to update workflow:", error);
    res.status(500).json({
      error: "An internal error occurred while updating the workflow.",
    });
  }
};

export const executeWorkflow = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const workflowId = req.params.id;
  if (!workflowId) {
    return res.status(400).json({ error: "Workflow ID is required" });
  }
  
  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId, userId },
    });

    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    if (!workflow.active) {
      return res.status(400).json({ error: "Workflow is not active" });
    }
    
    const execution = await prisma.execution.create({
      data: {
        workflowId,
        nodes: workflow.nodes as Prisma.InputJsonValue,
        connections: workflow.connections as Prisma.InputJsonValue,
        trigger: "manual",
        status: "PENDING"
      },
      select: {
        id: true,
        status: true,
        trigger: true,
        startedAt: true,
        workflowId: true
      }
    });

    res.status(201).json({ 
      message: "Workflow execution queued successfully",
      execution 
    });

  } catch (error) {
    console.error("Failed to execute workflow:", error);
    res.status(500).json({
      error: "An internal error occurred while executing the workflow.",
    });
  }
};