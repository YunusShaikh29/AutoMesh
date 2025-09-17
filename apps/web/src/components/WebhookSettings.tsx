import { z } from "zod";
import type { webhookTriggerNodeSchema } from "common/types";

type WebhookNode = z.infer<typeof webhookTriggerNodeSchema>;
interface Props {
  node: WebhookNode;
}

export function WebhookSettings({ node }: Props) {
  const webhookUrl = `${window.location.origin}/api/v0/webhooks/${node.id}`;
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Webhook Trigger</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Webhook URL
        </label>
        <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded-md break-all">
          This URL is a unique endpoint that you can send POST requests to from
          other services to trigger this workflow.
        </p>
        <input
          type="text"
          readOnly
          value={webhookUrl}
          className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 cursor-copy"
          onFocus={(e) => e.target.select()}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Path
        </label>
        <input
          type="text"
          placeholder="my-webhook-path"
          value={node.parameters?.path ?? ""}
          disabled
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          The unique node ID is used as
          the path.
        </p>
      </div>
    </div>
  );
}