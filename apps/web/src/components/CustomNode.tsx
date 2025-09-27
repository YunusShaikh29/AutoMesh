import { Handle, Position, type NodeProps } from "reactflow";

export type CustomNodeData = {
  label: string;
  onDelete: (id: string) => void;
};

export type CustomNodeProps = NodeProps<CustomNodeData>;

export function CustomNode({ id, data }: CustomNodeProps) {
  return (
    <div className="border border-[var(--color-border)] dark:border-[var(--color-border-dark)] p-4 rounded-lg bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)] shadow-lg relative group hover:shadow-xl transition-all duration-[var(--transition-duration)] hover:scale-105 min-w-[120px]">
      {/* Target handle on the LEFT */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-[var(--color-primary)] !border-2 !border-white dark:!border-[var(--color-bg-dark)] !w-3 !h-3" 
      />

      <div className="text-center">
        <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-2">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">{data.label}</p>
      </div>

      {/* Source handle on the RIGHT */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-[var(--color-primary)] !border-2 !border-white dark:!border-[var(--color-bg-dark)] !w-3 !h-3"
      />
      
      <button
        onClick={() => data.onDelete(id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-error)] text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all duration-[var(--transition-duration)] hover:scale-110 shadow-lg"
        aria-label="Delete node"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
