/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";
import type { aiAgentActionNodeSchema } from "common/types";
import type { AppNode } from "../pages/WorflowEditorCanvas";

type AIAgentNode = z.infer<typeof aiAgentActionNodeSchema>;

interface Props {
  node: AIAgentNode;
  onChange: (n: AppNode) => void;
}

export function AIAgentSettings({ node, onChange }: Props) {
  //   const prompt = (node.parameters?.prompt as string) || "";
  //   const model = (node.parameters?.model as string) || "gpt-4o-mini";

  const handleParameterChange = (key: string, value: string) => {
    onChange({
      ...node,
      //   @ts-ignore
      parameters: {
        ...node.parameters,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">AI Agent</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model
        </label>
        <select
          value={node.parameters?.model || "gpt-4o-mini"}
          onChange={(e) => handleParameterChange("model", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="gpt-4o-mini">gpt-4o-mini</option>
          <option value="gpt-4o">gpt-4o</option>
          <option value="claude-3-haiku">claude-3-haiku</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          System Prompt
        </label>
        <textarea
          value={node.parameters?.prompt || ""}
          onChange={(e) => handleParameterChange("prompt", e.target.value)}
          rows={5}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="You are a helpful assistant…"
        />
      </div>
    </div>
  );
}
