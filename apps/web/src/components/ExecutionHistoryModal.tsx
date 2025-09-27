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
      "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs";
    switch (status) {
      case "COMPLETED":
        return (
          <div className={`${iconClasses} bg-[var(--color-success)]`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "FAILED":
        return (
          <div className={`${iconClasses} bg-[var(--color-error)]`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case "RUNNING":
        return (
          <div className={`${iconClasses} bg-[var(--color-primary)]`}>
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        );
      default:
        return <div className={`${iconClasses} bg-gray-400`}>-</div>;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-2xl max-h-[80vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="heading text-2xl">Execution History</h2>
            <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60 mt-1">
              View and manage workflow executions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60 hover:opacity-100 rounded-lg hover:bg-[var(--color-accent)] dark:hover:bg-[var(--color-border-dark)] transition-all duration-[var(--transition-duration)]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-auto max-h-[60vh]">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-4">
                <div className="animate-pulse-subtle w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto"></div>
                <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Loading history...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {executions.length > 0
              ? executions.map((exec) => (
                  <div key={exec.id} className="group">
                    <Link
                      to={`/workflows/${workflowId}/executions/${exec.id}`}
                      className="block p-4 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] hover:border-[var(--color-primary)] hover:shadow-md transition-all duration-[var(--transition-duration)] hover:bg-[var(--color-accent)] dark:hover:bg-[var(--color-border-dark)]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <StatusIcon status={exec.status} />
                          <div>
                            <p className="font-semibold text-[var(--color-text)] dark:text-[var(--color-text-dark)] group-hover:text-[var(--color-primary)] transition-colors">
                              {exec.status}
                            </p>
                            <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60 font-mono">
                              {exec.id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                            {new Date(exec.startedAt).toLocaleString()}
                          </p>
                          {exec.completedAt && (
                            <p className="text-xs text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60">
                              Completed: {new Date(exec.completedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              : !isLoading && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="heading text-lg mb-2">No executions found</h3>
                    <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60">
                      Run your workflow to see execution history
                    </p>
                  </div>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionHistoryModal;
