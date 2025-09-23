import { type AppNode } from "../index";

/**
 * Safely retrieves a nested property from an object.
 */
const get = (obj: Record<string, any>, path: string): any => {
  if (!path) return obj;
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

interface ResolveParams {
  parameters: Record<string, any>;
  nodeOutputs: Record<string, any>;
  nodes: AppNode[];
}

export const resolveParameters = ({
  parameters,
  nodeOutputs,
  nodes,
}: ResolveParams): Record<string, any> => {
  const resolvedParameters = JSON.parse(JSON.stringify(parameters));

  //mapping of node names to node IDs for quick lookup
  const nodeNameIdMap = nodes.reduce((acc, node) => {
    acc[node.name] = node.id;
    return acc;
  }, {} as Record<string, string>);

  for (const key in resolvedParameters) {
    const value = resolvedParameters[key];

    if (typeof value !== "string") {
      continue;
    }

    const matches = value.match(/{{\s*([^}]+)\s*}}/g);
    if (!matches) {
      continue;
    }

    let finalValue: any = value;

    for (const match of matches) {
      const path = match.replace(/{{\s*|\s*}}/g, "");
      const pathParts = path.split(".");
      const sourceIdentifier = pathParts.shift(); //e.g, "AI Agent"

      if (!sourceIdentifier) continue;

      const sourceNodeId =
        nodeOutputs[sourceIdentifier] ? sourceIdentifier : nodeNameIdMap[sourceIdentifier];

      if (!sourceNodeId || !nodeOutputs[sourceNodeId]) continue;

      const sourceData = nodeOutputs[sourceNodeId];
      const remainingPath = pathParts.join(".");
      
      const replacementValue = get(sourceData, remainingPath);
      
      if (value === match) {
        finalValue = replacementValue;
        break;
      }

      finalValue = finalValue.replace(match, String(replacementValue ?? ""));
    }

    resolvedParameters[key] = finalValue;
  }

  return resolvedParameters;
};
