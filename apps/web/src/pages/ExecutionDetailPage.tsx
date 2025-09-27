/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface ExecutionLog {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeName: string;
  status: "COMPLETED" | "FAILED";
  inputData: any;
  outputData: any;
  error: string | null;
}

interface ExecutionDetails {
  id: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  startedAt: string;
  completedAt: string | null;
  error: string | null;
  logs: ExecutionLog[];
}

const StatusBadge = ({ status }: { status: string }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full text-white flex items-center gap-2";
  const statusClasses = {
    COMPLETED: "bg-[var(--color-success)]",
    FAILED: "bg-[var(--color-error)]",
    RUNNING: "bg-[var(--color-primary)]",
    PENDING: "bg-gray-500",
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>;
      case "FAILED":
        return <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>;
      case "RUNNING":
        return <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>;
      default:
        return <div className="w-3 h-3 bg-white rounded-full"></div>;
    }
  };
  
  return (
    <span
      className={`${baseClasses} ${statusClasses[status as keyof typeof statusClasses] || "bg-gray-400"}`}
    >
      {getStatusIcon(status)}
      {status}
    </span>
  );
};

const renderJson = (data: any) => {
  if (!data) return <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60">No data</p>;
  return (
    <pre className="bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] p-4 rounded-lg text-xs overflow-auto border border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
      <code className="text-[var(--color-text)] dark:text-[var(--color-text-dark)]">{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
};

const ExecutionDetailPage = () => {
  const { executionId } = useParams<{ executionId: string }>();
  const [execution, setExecution] = useState<ExecutionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExecutionDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/v0/executions/${executionId}`);
        setExecution(response.data);
      } catch (err) {
        setError("Failed to fetch execution details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExecutionDetails();
  }, [executionId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-pulse-subtle w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Loading execution details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="card">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="heading text-lg">Error Loading Execution</h3>
            <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!execution) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="heading text-xl mb-2">Execution not found</h3>
        <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
          The requested execution could not be found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="heading text-3xl">Execution Details</h1>
            <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60 mt-1">
              Detailed view of workflow execution
            </p>
          </div>
          <StatusBadge status={execution.status} />
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] p-4 rounded-lg">
            <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60">Execution ID</p>
            <p className="font-mono text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)]">{execution.id}</p>
          </div>
          <div className="bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] p-4 rounded-lg">
            <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60">Started</p>
            <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)]">{new Date(execution.startedAt).toLocaleString()}</p>
          </div>
          {execution.completedAt && (
            <div className="bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] p-4 rounded-lg">
              <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60">Completed</p>
              <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)]">{new Date(execution.completedAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {execution.error && (
        <div className="card border-[var(--color-error)] bg-red-50 dark:bg-red-900/10">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[var(--color-error)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-error)] mb-1">Workflow Error</h3>
              <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)]">{execution.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Execution Logs */}
      <div className="space-y-4">
        <h2 className="heading text-2xl">Execution Logs</h2>
        {execution.logs.map((log) => (
          <div key={log.id} className="card group hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="heading text-lg group-hover:text-[var(--color-primary)] transition-colors">
                  {log.nodeName}
                </h3>
                <p className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60 mt-1">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
              <StatusBadge status={log.status} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="subheading text-sm mb-3">Input Data</h4>
                {renderJson(log.inputData)}
              </div>
              <div>
                <h4 className="subheading text-sm mb-3">Output Data</h4>
                {renderJson(log.outputData)}
              </div>
            </div>

            {log.error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-600 dark:text-red-400 text-sm">Node Error</p>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">{log.error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutionDetailPage;
