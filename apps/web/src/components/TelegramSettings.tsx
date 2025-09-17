/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";
import type { telegramActionNodeSchema } from "common/types";
import type { AppNode } from "../pages/WorflowEditorCanvas";

type TelegramNode = z.infer<typeof telegramActionNodeSchema>;

interface Props {
  node: TelegramNode;
  onChange: (n: AppNode) => void;
}

export function TelegramSettings({ node, onChange }: Props) {
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
      <h3 className="text-lg font-semibold text-gray-800">
        Send Telegram Message
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chat ID
        </label>
        <input
          type="text"
          value={node.parameters?.chatId || ""}
          onChange={(e) => handleParameterChange("chatId", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Chat ID or Channel ID"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message Text
        </label>
        <textarea
          value={node.parameters?.message || ""}
          onChange={(e) => handleParameterChange("message", e.target.value)}
          rows={5}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Hello from n8n-v0!"
        />
      </div>
    </div>
  );
}
