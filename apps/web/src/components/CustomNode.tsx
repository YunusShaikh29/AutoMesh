import { Handle, Position, type NodeProps } from "reactflow";

export type CustomNodeData = {
  label: string;
  onDelete: (id: string) => void;
};

export type CustomNodeProps = NodeProps<CustomNodeData>;

export function CustomNode({ id, data }: CustomNodeProps) {
  return (
    <div className="border border-gray-300 p-3 rounded-md bg-white text-gray-900 shadow-md relative group">
      {/* Target handle on the LEFT */}
      <Handle type="target" position={Position.Left} className="!bg-teal-500" />

      <div className="text-center">{data.label}</div>

      {/* Source handle on the RIGHT */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-blue-500"
      />
      <button
        onClick={() => data.onDelete(id)}
        className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity -mt-2 -mr-2"
        aria-label="Delete node font-bold"
      >
        X
      </button>
    </div>
  );
}
