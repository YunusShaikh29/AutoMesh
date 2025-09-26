import { OAuth2Client } from "google-auth-library";
import { prisma } from "database/client";
import { encrypt } from "common/encryption";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

interface GmailCredential {
  accessToken: string;
  refreshToken: string;
  expiryDate: number;
}

interface SendGmailParams {
  credentialId: string;
  decryptedCredential: GmailCredential;
  to: string;
  subject: string;
  body: string;
}

const getOauth2Client = () => {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

export const sendGmail = async ({
  credentialId,
  decryptedCredential,
  to,
  subject,
  body,
}: SendGmailParams) => {
  const oauth2Client = getOauth2Client();


  oauth2Client.setCredentials({
    access_token: decryptedCredential.accessToken,
    refresh_token: decryptedCredential.refreshToken,
    expiry_date: decryptedCredential.expiryDate,
  });

  const isTokenExpired = decryptedCredential.expiryDate ? new Date() >= new Date(decryptedCredential.expiryDate) : false;

  if (isTokenExpired) {
    console.log("Access token expired. Refreshing...");
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      
      const newCredentialData = {
        accessToken: credentials.access_token,
        refreshToken: credentials.refresh_token || decryptedCredential.refreshToken,
        expiryDate: credentials.expiry_date,
      };

      const encryptedData = encrypt(JSON.stringify(newCredentialData));
      await prisma.credential.update({
        where: { id: credentialId },
        data: { data: encryptedData },
      });

      oauth2Client.setCredentials(credentials);
      console.log("Access token refreshed and database updated successfully.");

    } catch (err: any) {
        console.error("Failed to refresh access token.", err.response?.data || err.message);
        throw new Error("Failed to refresh Google access token. Please try reconnecting the credential.");
    }
  }
  
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  
  const emailLines = [
    `From: "me"`,
    `To: ${to}`,
    "Content-type: text/html;charset=iso-8859-1",
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    body,
  ];
  const email = emailLines.join("\r\n");
  
  const encodedMessage = Buffer.from(email).toString('base64url');

  try {
    const { data } = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMessage,
        },
    });
    return { success: true, messageId: data.id };
  } catch (err: any) {
    console.error("Failed to send email via Gmail.", err.response?.data || err.message);
    throw new Error(`Gmail API Error: ${err.response?.data?.error?.message || 'Failed to send email.'}`);
  }
};
