import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai_api_key =
  process.env.OPENAI_API_KEY || "";
// First calculate 3 + 4, then multiply the result by 2, then raise it to the power of 2

function sum(a: number, b: number) {
  return a + b;
}

function multiply(a: number, b: number) {
  return a * b;
}

function power(a: number, b: number) {
  return Math.pow(a, b);
}

const openai = new OpenAI({
  apiKey: openai_api_key,
});

const tools = [
  {
    type: "function" as const,
    function: {
      name: "sum",
      description: "Takes two number inputs and returns the sum of them.",
      parameters: {
        type: "object",
        properties: {
          a: {
            type: "number",
            description: "The first number to sum.",
          },
          b: {
            type: "number",
            description: "The second number to sum.",
          },
        },
        required: ["a", "b"],
        additionalProperties: false, // Fixes the error
      },
      strict: true,
    },
  },
  {
    type: "function" as const,
    function: {
      name: "multiply",
      description:
        "Takes two number inputs and returns the multiplied value of them.",
      parameters: {
        type: "object",
        properties: {
          a: {
            type: "number",
            description: "The first number to multiply.",
          },
          b: {
            type: "number",
            description: "The second number to multiply with.",
          },
        },
        required: ["a", "b"],
        additionalProperties: false, // Fixes the error
      },
      strict: true,
    },
  },
  {
    type: "function" as const,
    function: {
      name: "power",
      description:
        "Takes two number inputs first number is the base and second number is the power.",
      parameters: {
        type: "object",
        properties: {
          a: {
            type: "number",
            description: "The first number which is base.",
          },
          b: {
            type: "number",
            description: "The second number which is power.",
          },
        },
        required: ["a", "b"],
        additionalProperties: false, // Fixes the error
      },
      strict: true,
    },
  },
];

async function openAIFunctionCall(input: string) {
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful assistant that can call functions and help user",
    },
    {
      role: "user",
      content: input,
    },
  ];

  const response = await openai.chat.completions.create({
    messages: [
        {
          role: "system",
          content: "You are a helpful assistant that can call functions and help user",
        },
        {
          role: "user",
          content: input,
        },
      ],
    model: "gpt-4o-mini",
    tools: tools,
    max_completion_tokens: 1000,
  });

  const message = response.choices[0]?.message;

  if (!message) {
    console.error("No message in response");
    return response;
  }

  const toolResponses = [];

  if (message.tool_calls && message.tool_calls.length > 0) {
    for (const tool of message.tool_calls) {
      let toolResult;
      if (tool.type === "function") {
        console.log(
          `Function Name: ${tool.function.name}, Args: ${tool.function.arguments}`
        );
        const args = JSON.parse(tool.function.arguments);
        switch (tool.function.name) {
          case "sum":
            toolResult = sum(args?.a, args?.b);
            break;
          case "multiply":
            toolResult = multiply(args?.a, args?.b);
            break;
          case "power":
            toolResult = power(args?.a, args?.b);
            break;
          default:
            toolResult = "Unknown function";
        }
      } else {
        toolResult = "Unknown tool type";
      }

      toolResponses.push({
        role: "tool",
        tool_call_id: tool.id,
        content: JSON.stringify({ result: toolResult }),
      });
    }

    const finalResult = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that can call functions and help user",
        },
        { role: "user", content: input }, // Use dynamic input
        message,
        ...toolResponses,
      ],
      max_completion_tokens: 1000,
    });

    console.log("Final response:", finalResult?.choices[0]?.message.content);
    return finalResult;
  } else {
    console.log("Direct response:", message?.content);
    return response;
  }
}

const response = await openAIFunctionCall(
  "First calculate 3 + 4, then multiply the result by 2, then raise it to the power of 2"
);
// console.log(response);
