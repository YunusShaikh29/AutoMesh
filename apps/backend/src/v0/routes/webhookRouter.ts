import { Router } from 'express';
import { handleWebhook } from '../controllers/webhookController';

const router = Router();

// The '.all' method listens for all HTTP methods (GET, POST, PUT, DELETE, etc.)
router.all('/handler/:workflowId/:id', handleWebhook);

export { router as webhookRouter };

