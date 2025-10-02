import { type Response, type Request } from "express";
import { prisma } from "database/client";
import { gaxios, OAuth2Client } from "google-auth-library";
import type { AuthRequest } from "../middlewares/isAuthenticated";
import dotenv from "dotenv";
import { encrypt } from "common/encryption";

dotenv.config();

export const googleOAuthConnect = (req: AuthRequest, res: Response) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || "";  

    const oauth2Client = new OAuth2Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
    });

    const scopes = [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.compose",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.labels",
      "https://www.googleapis.com/auth/gmail.metadata",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      include_granted_scopes: true,
      prompt: "consent",
    });

    res.status(200).json({ url: authUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleOAuthCallback = async (req: AuthRequest, res: Response) => {
  try {
    const code = req.query.code as string;

    const clientId = process.env.GOOGLE_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || "";

    const oauth2Client = new OAuth2Client({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
    });

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userInfo: gaxios.GaxiosResponse<any> = await oauth2Client.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });
    const userEmail = userInfo.data.email;

    const credentialData = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    };

    const encryptedData = encrypt(JSON.stringify(credentialData));

    const credential = await prisma.credential.create({
      data: {
        userId: req.user?.id || "",
        type: "google_oauth",
        name: `Gmail (${userEmail})`,
        data: encryptedData,
      },
    });
    if (!credential) {
      return res.status(500).json({ message: "Failed to create credential" });
    }

    res.redirect(`${process.env.FRONTEND_URL}/credentials`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


