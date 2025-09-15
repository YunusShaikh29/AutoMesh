import { type Request, type Response } from 'express';
import { prisma } from 'database/client';

export const handleWebhook = async (req: Request, res: Response) => {

  const { id } = req.params;

  try {
    const webhook = await prisma.webhook.findUnique({
      where: { id },
      include: {
        workflow: {
          select: { name: true }, 
        },
      },
    });

    if (!webhook) {
      return res.status(404).json({ message: 'Webhook not found.' });
    }

    console.log(`[Webhook Handler] Received a ${req.method} request for webhook ID ${id}.`);
    console.log(`[Webhook Handler] This webhook is attached to workflow: "${webhook.workflow.name}"`);
    console.log('[Webhook Handler] In a real system, execution would start now.');
    console.log('[Webhook Handler] Request Body:', req.body);
    console.log('[Webhook Handler] Request Headers:', req.headers);

    res.status(200).json({ message: 'Webhook received.' });

  } catch (error) {
    console.error(`[Webhook Handler] Error processing webhook ${id}:`, error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

