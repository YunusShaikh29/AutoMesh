import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { createCredential, deleteCredentials, getCredentials, getOneCredential } from "../controllers/credentialController";


const router = Router()
router.post("/", isAuthenticated, createCredential)
router.get("/", isAuthenticated, getCredentials)
router.get("/:id", isAuthenticated, getOneCredential)
router.delete("/:id", isAuthenticated, deleteCredentials)

export {router as credentialsRouter}