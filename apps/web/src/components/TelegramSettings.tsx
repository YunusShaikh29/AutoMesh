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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Send Telegram Message
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Credential
        </label>
        <select
          value={node?.parameters?.credentialId}
          onChange={(e) =>
            handleParameterChange("credentialId", e.target.value)
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a credential</option>
          {credentials.map((cred) => (
            <option value={cred.id} key={cred.id}>
              {cred.name}
            </option>
          ))}
        </select>
      </div>

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
