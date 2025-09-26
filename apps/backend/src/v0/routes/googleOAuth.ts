import { Router } from "express";
import { googleOAuthCallback, googleOAuthConnect } from "../controllers/googleOAuthController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
const router = Router()

router.get("/oauth/google/connect", isAuthenticated, googleOAuthConnect)
router.get("/oauth/google/callback", isAuthenticated, googleOAuthCallback)

export {router as googleOAuthRouter}