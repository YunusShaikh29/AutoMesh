import { type Request, type Response } from 'express';
import { prisma } from 'database/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { AuthRequest } from '../middlewares/isAuthenticated';

export const signupOrSignin = async (req: Request, res: Response) => {
  const { email } = req.body;
  console.log("this is backend", email)

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, password: '' }, 
      });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.authToken.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });

    const DOMAIN = process.env.DOMAIN;
    if (!DOMAIN) {
      return res.status(500).json({ error: 'DOMAIN is not set' });
    }

    const magicLink = `${DOMAIN}/api/v0/auth/signin/post?token=${token}`;
    console.log(`Magic link for ${email}: ${magicLink}`);

    res.status(200).json({
      message: 'A magic link has been sent to your email. Please check your console.',
    });
  } catch (error) {
    console.error('Error during signup/signin:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const authToken = await prisma.authToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!authToken) {
      return res.status(404).json({ error: 'Invalid token' });
    }

    if (new Date() > authToken.expiresAt) {
      await prisma.authToken.delete({ where: { id: authToken.id } });
      return res.status(410).json({ error: 'Token has expired' });
    }
    
    const { user } = authToken;

    await prisma.authToken.delete({ where: { id: authToken.id } });

    const sessionToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' } 
    );

    res.cookie('auth_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
    });

    const FRONTEND_URL = process.env.FRONTEND_URL;
    if (!FRONTEND_URL) {
      return res.status(500).json({ error: 'FRONTEND_URL is not set' });
    }
    res.redirect(`${FRONTEND_URL}/dashboard`);

  } catch (error) {
    console.error('Error during token verification:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

export const getMe = (req: AuthRequest, res: Response)=> {
    const { user } = req;
    // console.log("this is backend", user)
    res.status(200).json({ user });
}