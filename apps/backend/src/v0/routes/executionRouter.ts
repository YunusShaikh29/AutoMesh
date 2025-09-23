import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  getExecutionsForWorkflow,
  getExecutionDetails,
} from "../controllers/executionController";

const router = Router();

router.get(
  "/workflows/:workflowId/executions",
  isAuthenticated,
  getExecutionsForWorkflow
);
router.get("/executions/:executionId", isAuthenticated, getExecutionDetails);

export {router as executionRouter};
