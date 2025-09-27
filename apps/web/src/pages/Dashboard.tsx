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

  const handleToggleWorkflow = async (workflowId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/v0/workflows/${workflowId}/toggle`);
      // Update the local state immediately for better UX
      setWorkflows(prevWorkflows => 
        prevWorkflows.map(workflow => 
          workflow.id === workflowId 
            ? { ...workflow, active: !workflow.active }
            : workflow
        )
      );
    } catch (err) {
      setError(`Failed to ${currentStatus ? 'deactivate' : 'activate'} workflow.`);
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-pulse-subtle w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Loading workflows...</p>
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
            <h3 className="heading text-lg">Error Loading Workflows</h3>
            <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">{error}</p>
          </div>
          <button onClick={fetchWorkflows} className="button-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading text-4xl">Dashboard</h1>
          <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80 mt-2">
            Manage your automation workflows
          </p>
        </div>
        <button
          className="button-primary flex items-center gap-2"
          onClick={handleCreateWorkflow}
          disabled={isLoading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Workflow
        </button>
      </div>

      {workflows.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="heading text-xl mb-2">No workflows yet</h3>
          <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80 mb-6">
            Get started by creating your first automation workflow
          </p>
          <button
            className="button-primary"
            onClick={handleCreateWorkflow}
            disabled={isLoading}
          >
            Create Your First Workflow
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="card group hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Link to={`/workflow/${workflow.id}`} className="block">
                    <h3 className="heading text-lg group-hover:text-[var(--color-primary)] transition-colors">
                      {workflow.name}
                    </h3>
                    <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80 text-sm mt-1">
                      {workflow.description}
                    </p>
                  </Link>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleDeleteWorkflow(workflow.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                  title="Delete workflow"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${workflow.active ? 'bg-[var(--color-success)]' : 'bg-gray-400'}`}></div>
                    <span className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
                      {workflow.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  
                  {/* Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWorkflow(workflow.id, workflow.active);
                    }}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
                      workflow.active 
                        ? 'bg-[var(--color-success)]' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    title={`${workflow.active ? 'Deactivate' : 'Activate'} workflow`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        workflow.active ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <Link 
                  to={`/workflow/${workflow.id}`}
                  className="text-[var(--color-primary)] hover:text-[var(--color-primary-light)] text-sm font-medium flex items-center gap-1"
                >
                  Edit
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
