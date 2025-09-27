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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="subheading">AI Agent</h3>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
          Credential
        </label>
        <select
          value={node.parameters?.credentialId || ""}
          onChange={(e) =>
            handleParameterChange("credentialId", e.target.value)
          }
          className="input"
        >
          <option value="">Select a credential</option>
          {credentials.map((cred) => (
            <option key={cred.id} value={cred.id}>
              {cred.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
          Model
        </label>
        <select
          value={node.parameters?.model || "gpt-4o-mini"}
          onChange={(e) => handleParameterChange("model", e.target.value)}
          className="input"
        >
          <option value="gpt-4o-mini">gpt-4o-mini</option>
          <option value="gpt-4o">gpt-4o</option>
          <option value="claude-3-haiku">claude-3-haiku</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
          System Prompt
        </label>
        <textarea
          value={node.parameters?.prompt || ""}
          onChange={(e) => handleParameterChange("prompt", e.target.value)}
          rows={5}
          className="input resize-none"
          placeholder="You are a helpful assistant…"
        />
      </div>
    </div>
  );
}
