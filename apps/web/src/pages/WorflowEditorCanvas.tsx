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
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from "reactflow";
import {
  ACTION_KIND,
  NODE_TYPE,
  TRIGGER_KIND,
  type nodeSchema,
  type connectionSchema,
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

  const handleAddNode = () => {
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
    if (!id) return;
    try {
      await handleSave();
      const response = await axios.post(`/api/v0/workflows/${id}/run`);
      const { executionId } = response.data;
      navigate(`/workflows/${id}/executions/${executionId}`);
    } catch (error: any) {
      console.error("Failed to run workflow:", error);
    }
  };

  // console.log("all of the workflow", workflow)
  const selectedNode =
    workflow?.nodes.find((n) => n.id === selectedNodeId) || null;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!workflow) {
    return <div>No workflow found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          name="name"
          value={workflow.name}
          onChange={handleWorkflowNameChange}
          className="text-sm font-semibold p-1 border border-gray-300 rounded w-22"
          //   make input width fit to content
        />
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={handleRunWorkflow}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Run
          </button>
          <button
            onClick={handleAddNode}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Webhook
          </button>
          <button
            onClick={handleAddAIAgentNode}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            AI Agent
          </button>
          <button
            onClick={handleAddEmailNode}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Email
          </button>
          <button
            onClick={handleAddTelegramNode}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Telegram
          </button>
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
          >
            History
          </button>
        </div>
      </div>
      <div className="flex justify-center">
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
            className="border-2 border-gray-300"
          >
            <Background className="text-white bg-gray-900" />
            <Controls />
          </ReactFlow>
        </div>
        {selectedNode && (
          <SettingsPanel
            selectedNode={selectedNode}
            onNodeChange={handleNodeChange}
            workflowId={id || ""}
          />
        )}
        {id && (
          <ExecutionHistoryModal
            workflowId={id || ""}
            isOpen={isHistoryModalOpen}
            onClose={() => setIsHistoryModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default WorkflowEditorCanvas;
