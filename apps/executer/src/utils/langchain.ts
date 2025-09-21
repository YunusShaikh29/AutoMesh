import { ChatOpenAI } from "@langchain/openai";

interface LLMParams {
  modelName: string;
  prompt: string;
  apiKey: string;
}

/**
 * Executes a Large Language Model call using LangChain.
 * @param {LLMParams} params - The parameters for the LLM call.
 * @returns {Promise<string | AIMessageContent>} The content of the AI's response.
 */
export const executeLLM = async ({ modelName, prompt, apiKey }: LLMParams) => {
  if (!apiKey) {
    throw new Error("API key is required for executing LLM.");
  }

  const model = new ChatOpenAI({
    modelName: modelName,
    apiKey: apiKey,
  });

  const response = await model.invoke(prompt);

  return response.content;
};
