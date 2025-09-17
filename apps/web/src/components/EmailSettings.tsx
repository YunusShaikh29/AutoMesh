/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";
import type { emailActionNodeSchema } from "common/types";
import type { AppNode } from "../pages/WorflowEditorCanvas";

type EmailNode = z.infer<typeof emailActionNodeSchema>;

interface Props {
  node: EmailNode;
  onChange: (n: AppNode) => void;
}

export function EmailSettings({ node, onChange }: Props) {
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
      <h3 className="text-lg font-semibold text-gray-800">Send Email</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          To
        </label>
        <input
          type="email"
          value={node.parameters?.to || ""}
          onChange={(e) => handleParameterChange("to", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="recipient@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          type="text"
          value={node.parameters?.subject || ""}
          onChange={(e) => handleParameterChange("subject", e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your email subject"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Body
        </label>
        <textarea
          value={node.parameters?.body || ""}
          onChange={(e) => handleParameterChange("body", e.target.value)}
          rows={5}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email body…"
        />
      </div>
    </div>
  );
}
