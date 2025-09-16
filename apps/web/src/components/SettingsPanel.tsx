import type { AppNode } from "../pages/WorflowEditorCanvas";

interface SettingsPanelProps {
  selectedNode: AppNode;
  onNodeChange: (node: AppNode) => void;
}

export function SettingsPanel({
  selectedNode,
  onNodeChange,
}: SettingsPanelProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNodeChange({ ...selectedNode, name: e.target.value });
  };

  return (
    <aside className="w-80 bg-white border-l border-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Label
        </label>
        <input
          type="text"
          value={selectedNode.name}
          onChange={handleNameChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">ID: {selectedNode.id}</p>
        <p className="text-sm text-gray-500">Type: {selectedNode.type}</p>
        <p className="text-sm text-gray-500">Kind: {selectedNode.kind}</p>
      </div>
    </aside>
  );
}