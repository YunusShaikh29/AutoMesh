import type { AppNode } from "../pages/WorflowEditorCanvas";
import { WebhookSettings } from "./WebhookSettings";
import { AIAgentSettings } from "./AIAgentSettings";
import { TelegramSettings } from "./TelegramSettings";
import { EmailSettings } from "./EmailSettings";

export interface SettingsPanelProps {
  selectedNode: AppNode | null;
  onNodeChange: (node: AppNode) => void;
}

export function SettingsPanel({
  selectedNode,
  onNodeChange,
}: SettingsPanelProps) {


  if (!selectedNode)
    return (
      <aside className="w-80 bg-white border-l border-gray-200 p-4">
        <p className="text-sm text-gray-500">Select a node to edit</p>
      </aside>
    );

  return (
    <aside className="w-80 bg-gray-100 border-l border-gray-500 p-4 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Settings</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Label
        </label>
        <input
          type="text"
          value={selectedNode.name}
          onChange={(e) =>
            onNodeChange({ ...selectedNode, name: e.target.value })
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {selectedNode.kind === "webhook" && (
        <WebhookSettings node={selectedNode} />
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

      <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
        <p>ID: {selectedNode.id}</p>
        <p>Type: {selectedNode.type}</p>
        <p>Kind: {selectedNode.kind}</p>
      </div>
    </aside>
  );
}
