/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { z } from "zod";
import { createWorkflowBodySchema } from "common/types";
import { Link } from "react-router-dom";
import axios from "axios";

type Workflow = z.infer<typeof createWorkflowBodySchema> & {
  id: string;
  active: boolean;
};

const Dashboard = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dummyWorkflowData = {
    name: "Workflow 1",
    description: "A new workflow",
    nodes: [],
    connections: [],
  };

  const handleCreateWorkflow = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/v0/workflows", dummyWorkflowData);

      setWorkflows([...workflows, response.data]);
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkflows = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/v0/workflows");
      setWorkflows(response.data.workflows);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "An error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (window.confirm("Are you sure you want to delete this workflow?")) {
      try {
        await axios.delete(`/api/v0/workflows/${workflowId}`);
        fetchWorkflows();
      } catch (err) {
        setError("Failed to delete workflow.");
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={handleCreateWorkflow}
      >
        Create New Workflow
      </button>
      {workflows.length === 0 ? (
        <div>No workflows found.</div>
      ) : (
        <div>
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="border p-4 mb-2 rounded flex justify-between items-center"
            >
              <Link to={`/workflow/${workflow.id}`} className="flex-grow">
                <h2 className="text-xl font-semibold">{workflow.name}</h2>
                <p>{workflow.description}</p>
                <p>Status: {workflow.active ? "Active" : "Inactive"}</p>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleDeleteWorkflow(workflow.id);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
