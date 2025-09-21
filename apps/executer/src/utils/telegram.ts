import TelegramBot from "node-telegram-bot-api";

interface TelegramParams {
  botToken: string;
  chatId: string;
  message: string;
}

/**
 * Sends a message to a Telegram chat using a bot.
 * @param {TelegramParams} params - The parameters for sending the message.
 * @returns {Promise<object>} A confirmation object if the message is sent successfully.
 */
export const sendTelegramMessage = async ({
  botToken,
  chatId,
  message,
}: TelegramParams): Promise<object> => {
  if (!botToken) {
    throw new Error("Telegram Bot Token is required.");
  }
  if (!chatId) {
    throw new Error("Chat ID is required.");
  }

  try {
    const bot = new TelegramBot(botToken);
    const sentMessage = await bot.sendMessage(chatId, message);

    return {
      success: true,
      messageId: sentMessage.message_id,
      chat: sentMessage.chat.id,
    };
  } catch (error: any) {
    console.error("Failed to send Telegram message:", error);
    // Re-throw a more user-friendly error
    throw new Error(`Telegram API Error: ${error.message}`);
  }
};
