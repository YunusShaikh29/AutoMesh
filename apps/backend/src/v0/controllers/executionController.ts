import { type Response } from "express";
import { type AuthRequest } from "../middlewares/isAuthenticated";
import { prisma } from "database/client";

export const getExecutionsForWorkflow = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user?.id;
  const { workflowId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow || workflow.userId !== userId) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    const executions = await prisma.execution.findMany({
      where: { workflowId },
      select: {
        id: true,
        status: true,
        startedAt: true,
        completedAt: true,
        error: true,
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    res.status(200).json(executions);
  } catch (error) {
    console.error("Failed to get executions for workflow:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

export const getExecutionDetails = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { executionId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const execution = await prisma.execution.findUnique({
      where: { id: executionId },
      include: {
        workflow: {
          select: { userId: true },
        },
        logs: {
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });

    if (!execution || execution.workflow.userId !== userId) {
      return res.status(404).json({ error: "Execution not found" });
    }

    const { workflow, ...executionDetails } = execution;

    res.status(200).json(executionDetails);
  } catch (error) {
    console.error("Failed to get execution details:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};
