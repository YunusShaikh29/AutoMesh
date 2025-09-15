import { Handle, Position, type NodeProps } from "reactflow";

// The data object that our custom node will receive from React Flow
export type CustomNodeData = {
  label: string;
};

// We can merge our custom data type with the NodeProps to get full type safety
export type CustomNodeProps = NodeProps<CustomNodeData>;

export function CustomNode({ data }: CustomNodeProps) {
  return (
    <div className="border border-gray-300 p-3 rounded-md bg-white text-gray-900 shadow-md">
      {/* Target handle on the LEFT */}
      <Handle type="target" position={Position.Left} className="!bg-teal-500" />

      {/* The node's label */}
      <div className="text-center">{data.label}</div>

      {/* Source handle on the RIGHT */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-blue-500"
      />
    </div>
  );
}
