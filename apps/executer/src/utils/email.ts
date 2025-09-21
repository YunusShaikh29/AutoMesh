import { Resend } from "resend";

interface EmailParams {
  apiKey: string;
  to: string;
  subject: string;
  body: string;
}

/**
 * Sends an email using the Resend API.
 * @param {EmailParams} params - The parameters for sending the email.
 * @returns {Promise<object>} A confirmation object if the email is sent successfully.
 */
export const sendEmail = async ({
  apiKey,
  to,
  subject,
  body,
}: EmailParams): Promise<object> => {
  if (!apiKey) {
    throw new Error("Resend API Key is required.");
  }

  try {
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Note: Resend requires a verified domain in production
      to: [to],
      subject: subject,
      html: `<p>${body}</p>`, // Assuming the body is plain text for now
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error: any) {
    console.error("Failed to send email via Resend:", error);
    throw new Error(`Resend API Error: ${error.message}`);
  }
};
