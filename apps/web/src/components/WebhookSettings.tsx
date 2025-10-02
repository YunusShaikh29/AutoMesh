/* eslint-disable @typescript-eslint/no-explicit-any */
import { type AppNode } from "../pages/WorflowEditorCanvas";
import { useState } from "react";

interface Props {
  node: AppNode;
  workflowId: any;
}

const baseUrl = import.meta.env.VITE_API_URL || "";

export const WebhookSettings = ({ node, workflowId }: Props) => {
  const [selectedMethod, setSelectedMethod] = useState("POST");
  const webhookUrl = `${baseUrl}/api/v0/webhook/handler/${workflowId}/${node.id}`;

  const httpMethods = [
    { value: "GET", label: "GET", color: "text-green-500" },
    { value: "POST", label: "POST", color: "text-blue-500" },
    { value: "PUT", label: "PUT", color: "text-red-500" },
    { value: "DELETE", label: "DELETE", color: "text-orange-500" },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${selectedMethod} ${webhookUrl}`);
    //add a toast
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h3 className="subheading">Webhook Trigger</h3>
      </div>
      
      <div className="bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] p-4 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
        <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80 mb-4">
          This is a unique endpoint that accepts all HTTP methods (GET, POST, PUT, DELETE, etc.) 
          from other services to trigger this workflow. The request data (body, headers, query params) 
          will be available as the output of this node.
        </p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
              HTTP Method
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="input"
            >
              {httpMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] p-4 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-mono text-[var(--color-text)] dark:text-[var(--color-text-dark)] break-all">
                  <span className={`font-bold ${httpMethods.find(m => m.value === selectedMethod)?.color || 'text-blue-500'}`}>
                    {selectedMethod}
                  </span> {webhookUrl}
                </span>
              </div>
              <button
                onClick={copyToClipboard}
                className="button-secondary text-xs px-3 py-1 flex-shrink-0"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] p-3 rounded-lg">
        <p className="text-xs text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60 font-medium mb-1">
          Node Information
        </p>
        <p className="text-xs text-[var(--color-text)] dark:text-[var(--color-text-dark)] font-mono">
          ID: {node.id}
        </p>
      </div>
    </div>
  );
};