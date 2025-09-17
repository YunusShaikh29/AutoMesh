import OpenAI from "openai";

const openai_api_key = process.env.OPENAI_API_KEY || "";

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
      description: "Takes two numbers and returns their sum.",
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
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
    type: "function" as const,
    function: {
      name: "multiply",
      description: "Takes two numbers and returns their product (multiplication).",
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
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
    type: "function" as const,
    function: {
      name: "power",
      description: "Takes two numbers and raises the first (base) to the power of the second (exponent).",
      parameters: {
        type: "object",
        properties: {
          a: {
            type: "number",
            description: "The base number.",
          },
          b: {
            type: "number",
            description: "The exponent to raise the base to.",
          },
        },
        required: ["a", "b"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
];

async function openAIFunctionCall(input: string) {
  let messages = [
    { 
      role: "system", 
      content: "You are a helpful assistant that can call functions to perform calculations step by step. Use tools one at a time if results depend on previous steps." 
    },
    { role: "user", content: input },
  ];

  const maxIterations = 10;  
  for (let i = 0; i < maxIterations; i++) {
    // Call API with current messages and tools
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      tools,
      max_completion_tokens: 1000,
    });

    const message = response.choices[0]?.message;
    if (!message) {
      console.error("No message in response");
      return response;
    }

    messages.push(message);

    if (!message.tool_calls || message.tool_calls.length === 0) {
      console.log("Final response:", message.content);
      return response;
    }

    const toolResponses = [];
    for (const tool of message.tool_calls) {
      let toolResult;
      if (tool.type === "function") {
        console.log(`Function Name: ${tool.function.name}, Args: ${tool.function.arguments}`);
        try {
          const args = JSON.parse(tool.function.arguments);
          switch (tool.function.name) {
            case "sum":
              toolResult = sum(args.a, args.b);
              break;
            case "multiply":
              toolResult = multiply(args.a, args.b);
              break;
            case "power":
              toolResult = power(args.a, args.b);
              break;
            default:
              toolResult = "Unknown function";
          }
        } catch (error: any) {
          toolResult = `Error executing tool: ${error.message}`;
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

    messages.push(...toolResponses);
  }

  console.error("Max iterations reached—possible loop detected");
  return null;
}

const response = await openAIFunctionCall("First calculate 3 + 4, then multiply the result by 2, then raise it to the power of 2");
console.log(response);
