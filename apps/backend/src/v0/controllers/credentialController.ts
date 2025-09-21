import { type NextFunction, type Response } from "express";
import { type AuthRequest } from "../middlewares/isAuthenticated";
import { prisma } from "database/client";
import { createCredentialBodySchema } from "common/types";
import { encrypt } from "common/encryption";
import { ZodError } from "zod";

export const createCredential = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }

  try {
    const { name, type, data } = createCredentialBodySchema.parse(req.body);

    console.log("data", data)

    const credentialExists = await prisma.credential.findFirst({
      where: { userId, name },
    });
    if (credentialExists) {
      return res
        .status(409)
        .json({ error: "A credential with this name already exists." });
    }

    const encryptedData = encrypt(JSON.stringify(data));
    
    console.log("encryptedData", encryptedData)

    const newCredential = await prisma.credential.create({
      data: {
        userId,
        name,
        type,
        data: encryptedData,
      },
    });

    res.status(201).json({
      id: newCredential.id,
      name: newCredential.name,
      type: newCredential.type,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid request body.", details: error.issues });
    }
    console.error("Failed to create credential:", error);
    res.status(500).json({
      error: "An internal error occurred while creating the credential",
    });
  }
};

export const getCredentials = async (
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
    const credentials = await prisma.credential.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });
    res.status(200).json(credentials);
  } catch (error) {
    console.error("Failed to get credentials:", error);
    res.status(500).json({
      error: "An internal error occurred while getting the credentials",
    });
  }
};

export const getOneCredential = async (
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
  const credentialId = req.params.id;
  if (!credentialId) {
    return res.status(400).json({ error: "Credential ID is required" });
  }

  try {
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId, userId },
    });
    if (!credential) {
      return res.status(404).json({ error: "Credential not found" });
    }
    res.status(200).json({ credential });
  } catch (error) {
    console.error("Failed to get credential:", error);
    res.status(500).json({
      error: "An internal error occurred while getting the credential",
    });
  }
};

export const deleteCredentials = async (
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
  const credentialId = req.params.id;
  if (!credentialId) {
    return res.status(400).json({ error: "Credential ID is required" });
  }
  try {
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId, userId },
    });
    if (!credential) {
      return res.status(404).json({ error: "Credential not found" });
    }
    await prisma.credential.delete({
      where: { id: credentialId },
    });
    res.status(200).json({ message: "Credential deleted successfully" });
  } catch (error) {
    console.error("Failed to delete credential:", error);
    res.status(500).json({
      error: "An internal error occurred while deleting the credential",
    });
  }
};
