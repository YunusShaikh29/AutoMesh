/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { createWorkflowBodySchema } from "common/types";
import { useEffect, useState, type ChangeEvent, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import ReactFlow, {
  Background,
  Controls,
  type Node as ReactFlowNode,
  type Edge as ReactFlowEdge,
  type OnNodesChange,
  type NodePositionChange,
  applyNodeChanges,
  type Connection as ReactFlowConnection,
  type OnConnect,
  type OnEdgesChange,
  addEdge,
  applyEdgeChanges,
} from "reactflow";
import {
  ACTION_KIND,
  NODE_TYPE,
  TRIGGER_KIND,
  type nodeSchema,
} from "common/types";
import { v4 as uuidv4 } from "uuid";
import { CustomNode } from "../components/CustomNode";
import { SettingsPanel } from "../components/SettingsPanel";
import ExecutionHistoryModal from "../components/ExecutionHistoryModal";

type Workflow = z.infer<typeof createWorkflowBodySchema> & {
  id: string;
  active: boolean;
};

export type AppNode = z.infer<typeof nodeSchema>;
type AppConnection = Workflow["connections"][number];

// Register our custom node type with React Flow
const nodeTypes = {
  custom: CustomNode,
};

const WorkflowEditorCanvas = () => {
  const { id } = useParams();
  const [workflow, setWorkflow] = useState<Workflow>();
  const [isLoading, setIsLaoding] = useState(true);
  const [error, setError] = useState(null);

  const [rfNodes, setRfNodes] = useState<ReactFlowNode[]>([]);
  const [rfEdges, setRfEdges] = useState<ReactFlowEdge[]>([]); // edges are our connections in the workflow db, reactflow expects an array of edges

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setWorkflow((currentWorkflow) => {
        if (!currentWorkflow) return currentWorkflow;

        // Also deselect the node if it was selected
        if (selectedNodeId === nodeId) {
          setSelectedNodeId(null);
        } 

        const updatedNodes = currentWorkflow.nodes.filter(
          (node) => node.id !== nodeId
        );
        const updatedConnections = currentWorkflow.connections.filter(
          (conn) => conn.source !== nodeId && conn.target !== nodeId
        );
        return {
          ...currentWorkflow,
          nodes: updatedNodes,
          connections: updatedConnections,
        };
      });
    },
    [setWorkflow, selectedNodeId]
  );

  useEffect(() => {
    const fetchworkflow = async () => {
      setIsLaoding(true);
      try {
        const reponse = await axios.get(`/api/v0/workflows/${id}`);
        setWorkflow(reponse.data?.workflow);
      } catch (error: any) {
        setError(error.response?.data?.message || "An error occurred");
      } finally {
        setIsLaoding(false);
      }
    };
    fetchworkflow();
  }, [id]);

  useEffect(() => {
    if (workflow?.nodes) {
      const transformNodes = workflow.nodes.map((node) => ({
        id: node.id,
        position: node.position,
        data: { label: node.name, onDelete: handleDeleteNode },
        type: "custom",
      }));
      setRfNodes(transformNodes);
    }
    if (workflow?.connections) {
      setRfEdges(workflow.connections);
    } else {
      setRfEdges([]);
    }
  }, [workflow, handleDeleteNode]);

  const handleWorkflowNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWorkflow((prevWorkflow) =>
      prevWorkflow ? { ...prevWorkflow, [name]: value } : undefined
    );
  };

  const handleSave = async () => {
    console.log("Saving workflow:", workflow);
    try {
      setIsLaoding(true);
      const response = await axios.put(`/api/v0/workflows/${id}`, workflow);
      console.log(response.data);
    } catch (error: any) {
      console.error(error.response.data.error || "An error occurred");
    } finally {
      setIsLaoding(false);
    }
  };

  const handleAddWebhookTrigger = () => {
    const newNode: AppNode = {
      id: uuidv4(),
      name: "Webhook Trigger",
      type: NODE_TYPE.trigger,
      kind: TRIGGER_KIND.webhook,
      position: { x: 100, y: 100 },
      description: "A webhook trigger",
      disabled: false,
      parameters: {},
    };
    setWorkflow((prevWorkflow) => {
      if (!prevWorkflow) return;
      return {
        ...prevWorkflow,
        nodes: [...prevWorkflow.nodes, newNode],
      };
    });
  };

  const handleAddManualTrigger = () => {
    const newNode: AppNode = {
      id: uuidv4(),
      name: "Manual Trigger",
      type: NODE_TYPE.trigger,
      kind: TRIGGER_KIND.manual,
      position: { x: 100, y: 100 },
      description: "A manual trigger - run this workflow manually",
      disabled: false,
      parameters: {},
    };
    setWorkflow((prevWorkflow) => {
      if (!prevWorkflow) return;
      return {
        ...prevWorkflow,
        nodes: [...prevWorkflow.nodes, newNode],
      };
    });
  };

  const handleAddAIAgentNode = () => {
    const newAIAgentNode: AppNode = {
      id: uuidv4(),
      name: "AI Agent",
      type: NODE_TYPE.action,
      kind: ACTION_KIND.aiAgent,
      position: { x: 200, y: 250 },
      description: "An AI Agent",
      disabled: false,
      parameters: {
        model: "gpt-4o-mini",
        prompt: "",
        credentialId: "",
      },
    };
    setWorkflow((prevWorkflow) => {
      if (!prevWorkflow) return;
      return {
        ...prevWorkflow,
        nodes: [...prevWorkflow.nodes, newAIAgentNode],
      };
    });
  };

  const handleAddEmailNode = () => {
    const newEmailNode: AppNode = {
      id: uuidv4(),
      name: "Send Email",
      type: NODE_TYPE.action,
      kind: ACTION_KIND.email,
      position: { x: 200, y: 350 },
      description: "Sends an email.",
      disabled: false,
      parameters: {
        credentialId: "",
        to: "",
        subject: "",
        body: "",
      },
    };
    setWorkflow((prevWorkflow) => {
      if (!prevWorkflow) return;
      return {
        ...prevWorkflow,
        nodes: [...prevWorkflow.nodes, newEmailNode],
      };
    });
  };

    const handleAddTelegramNode = () => {
    const newTelegramNode: AppNode = {
      id: uuidv4(),
      name: "Send Telegram Message",
      type: NODE_TYPE.action,
      kind: ACTION_KIND.telegram,
      position: { x: 200, y: 450 },
      description: "Sends a message to a Telegram chat.",
      disabled: false,
      parameters: {
        credentialId: "",
        chatId: "",
        message: "",
      },
    };
    setWorkflow((prevWorkflow) => {
      if (!prevWorkflow) return;
      return {
        ...prevWorkflow,
        nodes: [...prevWorkflow.nodes, newTelegramNode],
      };
    });
  };

  //this gets called when we connect two nodes
  const handleOnConnect: OnConnect = useCallback(
    (connection: ReactFlowConnection) => {
      console.log("A new connection was formed:", connection);
      const newConnection: AppConnection = {
        id: uuidv4(),
        source: connection.source!,
        target: connection.target!,
        sourceHandle: connection.sourceHandle || undefined,
        targetHandle: connection.targetHandle || undefined,
      };

      setRfEdges((prevEdges) => addEdge(newConnection, prevEdges));

      setWorkflow((prevWorkflow) => {
        if (!prevWorkflow) return;
        return {
          ...prevWorkflow,
          connections: [...prevWorkflow.connections, newConnection],
        };
      });
    },
    [setWorkflow]
  );

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setRfEdges((currentRfEdges) => applyEdgeChanges(changes, currentRfEdges));
  }, []);

  //this gets called when we move the nodes around
  const handleOnNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setRfNodes((currentRfNodes) => {
        const updatedRfNodes = applyNodeChanges(changes, currentRfNodes);

        const dragStopChange = changes.find(
          (change): change is NodePositionChange =>
            change.type === "position" && change.dragging === false
        );

        if (dragStopChange) {
          const finishedNode = updatedRfNodes.find(
            (node) => node.id === dragStopChange.id
          );

          if (finishedNode) {
            setWorkflow((currentWorkFlow) => {
              if (!currentWorkFlow) return currentWorkFlow;

              const updatedAppNodes = currentWorkFlow.nodes.map((appNode) => {
                if (appNode.id === finishedNode.id) {
                  return { ...appNode, position: finishedNode.position };
                }
                return appNode;
              });
              return { ...currentWorkFlow, nodes: updatedAppNodes };
            });
          }
        }

        return updatedRfNodes;
      });
    },
    [setWorkflow]
  );

  const handleOnNodeClick = useCallback((_: any, node: ReactFlowNode) => {
    setSelectedNodeId(node.id);
  }, []);

  const handOnPaneClick = () => {
    setSelectedNodeId(null);
  };

  //will pass this to settings panel
  const handleNodeChange = useCallback(
    (updatedNode: AppNode) => {
      setWorkflow((prevWorkflow) => {
        if (!prevWorkflow) return;
        const updatedNodes = prevWorkflow.nodes.map((node) => {
          if (node.id === updatedNode.id) {
            return { ...updatedNode };
          }
          return node;
        });
        return {
          ...prevWorkflow,
          nodes: updatedNodes,
        };
      });
    },
    [setWorkflow]
  );

  const handleRunWorkflow = async () => {
    if (!id || !workflow) return;
    
    // Check if workflow has any trigger nodes
    const hasTrigger = workflow.nodes.some(node => node.type === NODE_TYPE.trigger);
    if (!hasTrigger) {
      alert("Workflow must have at least one trigger node to run. Please add a Webhook Trigger or Manual Trigger.");
      return;
    }

    // Check if workflow has any action nodes
    const hasActions = workflow.nodes.some(node => node.type === NODE_TYPE.action);
    if (!hasActions) {
      alert("Workflow must have at least one action node to run. Please add an action node like AI Agent, Email, or Telegram.");
      return;
    }

    try {
      await handleSave();
      const response = await axios.post(`/api/v0/workflows/${id}/run`);
      const { executionId } = response.data;
      navigate(`/workflows/${id}/executions/${executionId}`);
    } catch (error: any) {
      console.error("Failed to run workflow:", error);
      if (error.response?.data?.error) {
        alert(`Failed to run workflow: ${error.response.data.error}`);
      }
    }
  };

  const handleToggleWorkflow = async () => {
    if (!id || !workflow) return;
    try {
      await axios.patch(`/api/v0/workflows/${id}/toggle`);
      setWorkflow(prevWorkflow => 
        prevWorkflow ? { ...prevWorkflow, active: !prevWorkflow.active } : prevWorkflow
      );
    } catch (error: any) {
      console.error("Failed to toggle workflow:", error);
    }
  };

  // console.log("all of the workflow", workflow)
  const selectedNode =
    workflow?.nodes.find((n) => n.id === selectedNodeId) || null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-pulse-subtle w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)]">Loading workflow...</p>
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
            <h3 className="heading text-lg">Error Loading Workflow</h3>
            <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-[var(--color-accent)] dark:bg-[var(--color-border-dark)] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="heading text-xl mb-2">No workflow found</h3>
        <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-80">
          The requested workflow could not be found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="name"
              value={workflow.name}
              onChange={handleWorkflowNameChange}
              className="heading text-2xl bg-transparent border-none outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 rounded px-2 py-1 -ml-2"
              placeholder="Workflow Name"
            />
            <p className="text-[var(--color-text)] dark:text-[var(--color-text-dark)] opacity-60 mt-1">
              Build your automation workflow
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="button-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Save
            </button>
            <button
              onClick={handleRunWorkflow}
              className="button-primary bg-[var(--color-success)] hover:bg-[var(--color-success)]/90 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
              Run
            </button>
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="button-secondary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </button>
            
            {/* Workflow Status Toggle */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${workflow.active ? 'bg-[var(--color-success)]' : 'bg-gray-400'}`}></div>
                <span className="text-sm text-[var(--color-text)] dark:text-[var(--color-text-dark)] font-medium">
                  {workflow.active ? "Active" : "Inactive"}
                </span>
              </div>
              <button
                onClick={handleToggleWorkflow}
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
          </div>
        </div>
      </div>

      {/* Node Controls */}
      <div className="card">
        <h3 className="subheading mb-4">Add Nodes</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAddWebhookTrigger}
            className="button-secondary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Webhook Trigger
          </button>
          <button
            onClick={handleAddManualTrigger}
            className="button-secondary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
            </svg>
            Manual Trigger
          </button>
          <button
            onClick={handleAddAIAgentNode}
            className="button-secondary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Agent
          </button>
          <button
            onClick={handleAddEmailNode}
            className="button-secondary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Send Email
          </button>
          <button
            onClick={handleAddTelegramNode}
            className="button-secondary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Send Telegram
          </button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="card p-0 overflow-hidden">
        <div className="h-[80vh] w-full">
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            nodeTypes={nodeTypes}
            onNodeClick={handleOnNodeClick}
            onNodesChange={handleOnNodesChange}
            onConnect={handleOnConnect}
            onEdgesChange={onEdgesChange}
            onPaneClick={handOnPaneClick}
            className="border-0"
          >
            <Background 
              className="bg-[var(--color-accent)] dark:bg-[var(--color-bg-dark)]" 
              color="var(--color-border)"
              gap={20}
            />
            <Controls 
              className="bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border)] dark:border-[var(--color-border-dark)]"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Settings Panel */}
      {selectedNode && (
        <SettingsPanel
          selectedNode={selectedNode}
          onNodeChange={handleNodeChange}
          workflowId={id || ""}
        />
      )}
      
      {/* Execution History Modal */}
      {id && (
        <ExecutionHistoryModal
          workflowId={id || ""}
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
        />
      )}
    </div>
  );
};

export default WorkflowEditorCanvas;
