import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { createWorkflow, getWorkflows, getOneWorkflow, updateWorkflow } from "../controllers/workflowController";
const router = Router()

router.post("/", isAuthenticated, createWorkflow)
router.get("/", isAuthenticated, getWorkflows)
router.get("/:id", isAuthenticated, getOneWorkflow)
router.put("/:id", isAuthenticated, updateWorkflow)

export {router as workflowRouter}