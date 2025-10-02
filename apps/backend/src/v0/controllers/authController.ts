import { type Request, type Response } from "express";
import { prisma } from "database/client";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import type { AuthRequest } from "../middlewares/isAuthenticated";

const resend = new Resend(process.env.RESEND_API_KEY as string);

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`${name} is not set`);
  }
  return v;
}

export const signupOrSignin = async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email, password: "" } });
    }

    const token = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.authToken.create({
      data: { token, expiresAt, userId: user.id },
    });

    const FRONTEND_URL = requireEnv("FRONTEND_URL");
    const verifyUrl = new URL("/api/v0/auth/signin/post", FRONTEND_URL);
    verifyUrl.searchParams.set("token", token);
    const magicLink = verifyUrl.toString();

    if (process.env.NODE_ENV === "production") {
      requireEnv("RESEND_API_KEY");
      await resend.emails.send({
        from: `No Reply <no-reply@mail.yunus100x.dev>`,
        to: [email],
        subject: "Your Magic Sign-In Link",
        html: `
          <p>Click the link below to sign in:</p>
          <a href="${magicLink}">Sign in</a>
          <p>This link expires in 15 minutes.</p>
        `,
      });
      return res
        .status(200)
        .json({ message: "A magic link has been sent to your email." });
    } else {
      console.log(`Magic link for ${email}: ${magicLink}`);
      return res.status(200).json({
        message:
          "A magic link has been sent to your email. Please check your console.",
      });
    }
  } catch (error) {
    console.error("Error during signup/signin:", error);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  const token = String(req.query.token ?? "");
  if (!token) return res.status(400).json({ error: "Token is required" });

  try {
    const authToken = await prisma.authToken.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!authToken) return res.status(404).json({ error: "Invalid token" });
    if (new Date() > authToken.expiresAt) {
      await prisma.authToken.delete({ where: { id: authToken.id } });
      return res.status(410).json({ error: "Token has expired" });
    }

    const { user } = authToken;

    await prisma.authToken.delete({ where: { id: authToken.id } });

    const sessionToken = jwt.sign(
      { userId: user.id, email: user.email },
      requireEnv("JWT_SECRET"),
      { expiresIn: "7d" }
    );

    res.cookie("auth_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const FRONTEND_URL = requireEnv("FRONTEND_URL");
    return res.redirect(303, new URL("/dashboard", FRONTEND_URL).toString());
  } catch (error) {
    console.error("Error during token verification:", error);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};

export const getMe = (req: AuthRequest, res: Response) => {
  const { user } = req;
  return res.status(200).json({ user });
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res
      .status(500)
      .json({ error: "An internal server error occurred during logout." });
  }
};
