import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface ExecutionSummary {
  id: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  startedAt: string;
  completedAt: string | null;
}

interface Props {
  workflowId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ExecutionHistoryModal = ({ workflowId, isOpen, onClose }: Props) => {
  const [executions, setExecutions] = useState<ExecutionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchExecutions = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `/api/v0/workflows/${workflowId}/executions`
          );
          setExecutions(response.data);
          setError(null);
        } catch (err) {
          setError("Failed to fetch execution history.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchExecutions();
    }
  }, [isOpen, workflowId]);

  if (!isOpen) {
    return null;
  }

  const StatusIcon = ({ status }: { status: string }) => {
    const iconClasses =
      "w-5 h-5 rounded-full flex items-center justify-center text-white text-xs";
    switch (status) {
      case "COMPLETED":
        return <div className={`${iconClasses} bg-green-500`}>✓</div>;
      case "FAILED":
        return <div className={`${iconClasses} bg-red-500`}>!</div>;
      case "RUNNING":
        return (
          <div className={`${iconClasses} bg-blue-500 animate-pulse`}>…</div>
        );
      default:
        return <div className={`${iconClasses} bg-gray-400`}>-</div>;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Execution History</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        <div className="overflow-auto max-h-[70vh]">
          {isLoading && <p>Loading history...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <ul className="divide-y divide-gray-200">
            {executions.length > 0
              ? executions.map((exec) => (
                  <li key={exec.id} className="p-3 hover:bg-gray-50">
                    <Link
                      to={`/workflows/${workflowId}/executions/${exec.id}`}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <StatusIcon status={exec.status} />
                        <div>
                          <p className="font-semibold">{exec.status}</p>
                          <p className="text-sm text-gray-500">ID: {exec.id}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {new Date(exec.startedAt).toLocaleString()}
                      </span>
                    </Link>
                  </li>
                ))
              : !isLoading && (
                  <p className="p-4 text-gray-500">No executions found.</p>
                )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExecutionHistoryModal;
