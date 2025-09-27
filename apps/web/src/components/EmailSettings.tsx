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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="subheading">Send Email</h3>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="credential"
          className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]"
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
          className="input"
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
          To
        </label>
        <input
          type="email"
          value={node.parameters?.to || ""}
          onChange={(e) => handleParameterChange("to", e.target.value)}
          className="input"
          placeholder="recipient@example.com"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
          Subject
        </label>
        <input
          type="text"
          value={node.parameters?.subject || ""}
          onChange={(e) => handleParameterChange("subject", e.target.value)}
          className="input"
          placeholder="Your email subject"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
          Body
        </label>
        <textarea
          value={node.parameters?.body || ""}
          onChange={(e) => handleParameterChange("body", e.target.value)}
          rows={5}
          className="input resize-none"
          placeholder="Email body…"
        />
      </div>
    </div>
  );
}
