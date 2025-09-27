/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";
import { type telegramActionNodeSchema, CREDENTIAL_TYPE } from "common/types";
import type { AppNode } from "../pages/WorflowEditorCanvas";
import { useEffect, useState } from "react";
import axios from "axios";

type TelegramNode = z.infer<typeof telegramActionNodeSchema>;

interface Credential {
  id: string;
  type: string;
  name: string;
}

interface Props {
  node: TelegramNode;
  onChange: (n: AppNode) => void;
}

export function TelegramSettings({ node, onChange }: Props) {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await axios.get<Credential[]>("/api/v0/credentials");
        const telegramCredentials = response.data.filter(
          (cred) => cred.type === CREDENTIAL_TYPE.telegram
        );
        setCredentials(telegramCredentials);
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="subheading">Send Telegram Message</h3>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
          Credential
        </label>
        <select
          value={node?.parameters?.credentialId}
          onChange={(e) =>
            handleParameterChange("credentialId", e.target.value)
          }
          className="input"
        >
          <option value="">Select a credential</option>
          {credentials.map((cred) => (
            <option value={cred.id} key={cred.id}>
              {cred.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
          Chat ID
        </label>
        <input
          type="text"
          value={node.parameters?.chatId || ""}
          onChange={(e) => handleParameterChange("chatId", e.target.value)}
          className="input"
          placeholder="Enter Chat ID or Channel ID"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
          Message Text
        </label>
        <textarea
          value={node.parameters?.message || ""}
          onChange={(e) => handleParameterChange("message", e.target.value)}
          rows={5}
          className="input resize-none"
          placeholder="Hello from n8n-v0!"
        />
      </div>
    </div>
  );
}
