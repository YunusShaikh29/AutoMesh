/**
 * Safely retrieves a nested property from an object.
 * @param obj The object to query.
 * @param path The path to the property (e.g., 'a.b.c').
 * @returns The value at the path, or undefined if not found.
 */
const get = (obj: Record<string, any>, path: string): any => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

interface ResolveParams {
  parameters: Record<string, any>; //parameter object of the current node
  nodeOutputs: Record<string, any>; //the map of all previous node outputs.
}

export const resolveParameters = ({
  parameters,
  nodeOutputs,
}: ResolveParams): Record<string, any> => {
  // deep copy the parameters
  const resolvedParameters = JSON.parse(JSON.stringify(parameters));

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
      // Extract the path from inside the curly braces, e.g., "node-1.result.text"
      const path = match.replace(/{{\s*|\s*}}/g, "");

      const replacementValue = get(nodeOutputs, path);

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
