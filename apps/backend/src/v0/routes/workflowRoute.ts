import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  createWorkflow,
  getWorkflows,
  getOneWorkflow,
  updateWorkflow,
  runWorkflow,
  deleteWorkflow,
  toggleWorkflowStatus,
} from "../controllers/workflowController";
const router = Router()

router.post("/", isAuthenticated, createWorkflow)
router.get("/", isAuthenticated, getWorkflows)
router.get("/:id", isAuthenticated, getOneWorkflow)
router.put("/:id", isAuthenticated, updateWorkflow);
router.delete("/:id", isAuthenticated, deleteWorkflow);
router.patch("/:id/toggle", isAuthenticated, toggleWorkflowStatus);

router.post("/:workflowId/run", isAuthenticated, runWorkflow);

export {router as workflowRouter}