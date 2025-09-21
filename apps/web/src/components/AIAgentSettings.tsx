/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";
import type { aiAgentActionNodeSchema } from "common/types";
import type { AppNode } from "../pages/WorflowEditorCanvas";
import { useEffect, useState } from "react";
import axios from "axios";
import { CREDENTIAL_TYPE } from "common/types";

type AIAgentNode = z.infer<typeof aiAgentActionNodeSchema>;

interface Credential {
  id: string;
  name: string;
  type: string;
}

interface Props {
  node: AIAgentNode;
  onChange: (n: AppNode) => void;
}

export function AIAgentSettings({ node, onChange }: Props) {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await axios.get<Credential[]>("/api/v0/credentials");
        const openAICredentials = response.data.filter(
          (cred) => cred.type === CREDENTIAL_TYPE.openai
        );
        setCredentials(openAICredentials);
      } catch (error) {
        console.error("Failed to fetch credentials:", error);
      }
    };

    fetchCredentials();
  }, []);

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
          Credential
        </label>
        <select
          value={node.parameters?.credentialId || ""}
          onChange={(e) =>
            handleParameterChange("credentialId", e.target.value)
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a credential</option>
          {credentials.map((cred) => (
            <option key={cred.id} value={cred.id}>
              {cred.name}
            </option>
          ))}
        </select>
      </div>

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
