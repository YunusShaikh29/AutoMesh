/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { createWorkflowBodySchema } from "common/types";
import { useEffect, useState, type ChangeEvent, useCallback } from "react";
import { useParams } from "react-router-dom";
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
import { NODE_TYPE, TRIGGER_KIND } from "common/types";
import { v4 as uuidv4 } from "uuid";
import { CustomNode } from "../components/CustomNode";

type Workflow = z.infer<typeof createWorkflowBodySchema> & {
  id: string;
  active: boolean;
};

type AppNode = Workflow["nodes"][number];
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
        data: { label: node.name },
        type: "custom",
      }));
      setRfNodes(transformNodes);
    }
    if (workflow?.connections) {
      setRfEdges(workflow.connections);
    } else {
      setRfEdges([]);
    }
  }, [workflow]);

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
      console.error(error.response?.data?.message || "An error occurred");
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

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      // Your logic to delete edges will go here.
      console.log("Edge changes:", changes);
    },
    [setWorkflow]
  );

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

          console.log("changes", changes);
          console.log("updatedRfNodes", updatedRfNodes);
          console.log("dragStopChange", dragStopChange);
          console.log("finishedNode", finishedNode);

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
            onClick={handleAddNode}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Add Webhook Trigger Node
          </button>
        </div>
      </div>
      <div className="h-[80vh] w-full">
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={nodeTypes}
          onNodesChange={handleOnNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleOnConnect}
          className="border-2 border-gray-300"
        >
          <Background className="text-white bg-gray-900" />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default WorkflowEditorCanvas;
