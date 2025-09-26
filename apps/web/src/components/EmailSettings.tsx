/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";
import { type emailActionNodeSchema, CREDENTIAL_TYPE } from "common/types";
import type { AppNode } from "../pages/WorflowEditorCanvas";
import { useEffect, useState } from "react";
import axios from "axios";

type EmailNode = z.infer<typeof emailActionNodeSchema>;

interface Credential {
  name: string;
  id: string;
  type: string;
}

interface Props {
  node: EmailNode;
  onChange: (n: AppNode) => void;
}

export function EmailSettings({ node, onChange }: Props) {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const response = await axios.get<Credential[]>("/api/v0/credentials");
        const emailCredentials = response.data.filter(
          (cred) =>cred.type === CREDENTIAL_TYPE.email || cred.type === CREDENTIAL_TYPE.google_oauth
        );
        setCredentials(emailCredentials);
      } catch (error) {
        console.log("Failed to fetch the credentials", error);
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

  // Filter for credentials that can be used for sending emails
  const emailCredentials = credentials.filter(
    (cred) => cred.type === CREDENTIAL_TYPE.email || cred.type === CREDENTIAL_TYPE.google_oauth
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Send Email</h3>

      <div className="mb-4">
        <label
          htmlFor="credential"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Credential
        </label>
        <select
          id="credential"
          name="credentialId"
          value={node.parameters?.credentialId || ""}
          onChange={(e) =>
            onChange({
              ...node,
              //   @ts-ignore
              parameters: {
                ...node.parameters,
                // @ts-ignore
                credentialId: e.target.value || "",
              },
            })
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">
            Select a credential
          </option>
          {emailCredentials.map((cred) => (
            <option key={cred.id} value={cred.id}>
              {cred.name}
            </option>
          ))}
        </select>
      </div>

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
