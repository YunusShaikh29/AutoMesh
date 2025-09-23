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
  const baseClasses = "px-2 py-1 text-xs font-bold rounded-full text-white";
  const statusClasses = {
    COMPLETED: "bg-green-500",
    FAILED: "bg-red-500",
    RUNNING: "bg-blue-500",
    PENDING: "bg-gray-500",
  };
  return (
    <span
      className={`${baseClasses} ${statusClasses[status as keyof typeof statusClasses] || "bg-gray-400"}`}
    >
      {status}
    </span>
  );
};

const renderJson = (data: any) => {
  if (!data) return <p className="text-gray-500">No data</p>;
  return (
    <pre className="bg-gray-100 p-2 rounded-md text-xs overflow-auto">
      <code>{JSON.stringify(data, null, 2)}</code>
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

  if (isLoading) return <div className="p-8">Loading execution details...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!execution) return <div className="p-8">Execution not found.</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Execution Details</h1>
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
          <StatusBadge status={execution.status} />
          <span>ID: {execution.id}</span>
          <span>Started: {new Date(execution.startedAt).toLocaleString()}</span>
          {execution.completedAt && (
            <span>
              Completed: {new Date(execution.completedAt).toLocaleString()}
            </span>
          )}
        </div>

        {execution.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
            <strong className="font-bold">Workflow Error: </strong>
            <span>{execution.error}</span>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Execution Logs</h2>
          {execution.logs.map((log) => (
            <div key={log.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">{log.nodeName}</h3>
                <StatusBadge status={log.status} />
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Timestamp: {new Date(log.timestamp).toLocaleString()}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1">Input Data</h4>
                  {renderJson(log.inputData)}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Output Data</h4>
                  {renderJson(log.outputData)}
                </div>
              </div>

              {log.error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md">
                  <strong className="font-semibold">Node Error: </strong>
                  <span>{log.error}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutionDetailPage;
