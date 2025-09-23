/* eslint-disable @typescript-eslint/no-explicit-any */
import { type AppNode } from "../pages/WorflowEditorCanvas";

interface Props {
  node: AppNode;
  workflowId: any;
}

export const WebhookSettings = ({ node, workflowId }: Props) => {
  const baseUrl = "http://localhost:8080";
  const webhookUrl = `${baseUrl}/webhook/handler/${workflowId}/${node.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    //add a toast
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Webhook Trigger</h3>
      
      <p className="text-sm text-gray-600 mb-2">
        This is a unique endpoint that you can send HTTP POST requests to from
        other services to trigger this workflow. The request body will be the
        output of this node.
      </p>

      <div className="bg-gray-100 p-2 rounded-md">
        <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-gray-800 pr-2 overflow-x-auto">
                <span className="font-bold text-green-600">POST</span> {webhookUrl}
            </span>
            <button
                onClick={copyToClipboard}
                className="bg-gray-200 text-gray-700 text-xs font-bold py-1 px-2 rounded hover:bg-gray-300"
            >
                Copy
            </button>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <p className="text-xs text-gray-500">
          Node ID: {node.id}
        </p>
      </div>
    </div>
  );
};