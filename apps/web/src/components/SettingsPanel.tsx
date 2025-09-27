import type { AppNode } from "../pages/WorflowEditorCanvas";
import { WebhookSettings } from "./WebhookSettings";
import { AIAgentSettings } from "./AIAgentSettings";
import { TelegramSettings } from "./TelegramSettings";
import { EmailSettings } from "./EmailSettings";



export interface SettingsPanelProps {
  selectedNode: AppNode | null;
  onNodeChange: (node: AppNode) => void;
  workflowId: string;
}

export function SettingsPanel({
  selectedNode,
  onNodeChange,
  workflowId
}: SettingsPanelProps) {


  if (!selectedNode)
    return (
      <aside className="w-80 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border-l border-[var(--color-border)] dark:border-[var(--color-border-dark)] p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h3 className="heading text-lg">Select a Node</h3>
            <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60">
              Click on a node to configure its settings
            </p>
          </div>
        </div>
      </aside>
    );

  return (
    <aside className="w-80 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border-l border-[var(--color-border)] dark:border-[var(--color-border-dark)] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading text-xl">Node Settings</h2>
        <div className="w-2 h-2 bg-[var(--color-success)] rounded-full"></div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">
          Node Name
        </label>
        <input
          type="text"
          value={selectedNode.name}
          onChange={(e) =>
            onNodeChange({ ...selectedNode, name: e.target.value })
          }
          className="input"
          placeholder="Enter node name"
        />
      </div>

      {selectedNode.kind === "webhook" && (
        <WebhookSettings node={selectedNode} workflowId={workflowId} />
      )}
      {selectedNode.kind === "aiAgent" && (
        <AIAgentSettings node={selectedNode} onChange={onNodeChange} />
      )}
      {selectedNode.kind === "telegram" && (
        <TelegramSettings node={selectedNode} onChange={onNodeChange} />
      )}
      {selectedNode.kind === "email" && (
        <EmailSettings node={selectedNode} onChange={onNodeChange} />
      )}

      <div className="pt-4 border-t border-[var(--color-border)] dark:border-[var(--color-border-dark)] space-y-2">
        <div className="bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] p-3 rounded-lg">
          <p className="text-xs text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60 font-medium">Node Information</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-[var(--color-text)] dark:text-[var(--color-text-dark)] font-mono">ID: {selectedNode.id}</p>
            <p className="text-xs text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Type: {selectedNode.type}</p>
            <p className="text-xs text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Kind: {selectedNode.kind}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
