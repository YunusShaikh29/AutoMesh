import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { createWorkflow, getWorkflows, getOneWorkflow, updateWorkflow, executeWorkflow } from "../controllers/workflowController";
const router = Router()

router.post("/", isAuthenticated, createWorkflow)
router.get("/", isAuthenticated, getWorkflows)
router.get("/:id", isAuthenticated, getOneWorkflow)
router.put("/:id", isAuthenticated, updateWorkflow)
router.post("/:id/execute", isAuthenticated, executeWorkflow)

export {router as workflowRouter}