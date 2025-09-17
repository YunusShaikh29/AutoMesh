import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "database/client";
import dotenv from "dotenv";
dotenv.config();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  //   // --- DEBUGGING LOGS ---
  //   console.log('Middleware: Found auth_token cookie:', token);
  //   console.log('Middleware: JWT_SECRET value:', process.env.JWT_SECRET);
  //

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    // console.log(decoded);
    const user = await prisma.user.findUnique({
      where: {
        //@ts-ignore
        id: decoded?.userId,
      },
    });

    if (!user) {
      return res.json(401).json({ error: "Unauthorized: User not found!" });
    }

    req.user = { id: user.id, email: user.email };

    next();
  } catch (error) {
    console.error("Middleware: Error during JWT verification:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
