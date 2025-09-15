import { z } from 'zod';

export enum NODE_TYPE {
  trigger = "trigger",
  action = "action",
}
export enum Credentials {
  email = "email",
  telegram = "telegram",
}

export enum TRIGGER_KIND {
  webhook = "webhook",
  manual = "manual",
}

export enum ACTION_KIND {
  telegram = "telegram",
  email = "email",
}

export interface Parameters {
  // [key: string]: string | number | boolean | object;
  [key: string]: any
}

export interface BaseNode {
  id: string;
  name: string;
  description?: string
  position: [number, number];
  disabled?: boolean;
  parameters?: Parameters;
}

export interface TriggerNode extends BaseNode {
  type: NODE_TYPE.trigger;
  kind: TRIGGER_KIND;
}

export interface ActionNode extends BaseNode {
  type: NODE_TYPE.action;
  kind: ACTION_KIND;
}

export type Node = ActionNode | TriggerNode;


export type Nodes = Node[];


export interface ConnectionTarget {
    node: string            //the node which we have to connect to
    input: string           //the input of the node which we have to connect to eg. main,
}

export type Connections = {
    [sourceNodeName: string]: {
        [outputName: string]: ConnectionTarget[] //outputName is the name of the output of the source node eg. main, error, etc.
    }
}

// export interface Connection {
//   source: {
//     node: string; 
//     outputName: string; // e.g., "main"
//   };
//   target: {
//     node: string;
//     inputName: string; // e.g., "main"
//   };
// }

// export type Connections = Connection[];







// export type Connections

// {"trigger a webhook": {
//     "main": [
//         {
//             sourceNode: "trigger a webhook",
//             targetNode: "send confirmation email"
//         }
//     ]
// }}

/* 
    {
  "Catch Customer Inquiry": {
    "main": [
      [
        {
          "node": "Send Confirmation Email",
          "input": "main"
        }
      ],
      [
        {
          "node": "Notify Support Team",
          "input": "main"
        }
      ]
    ]
  }
}
*/

// Zod Schemas for Validation
const parameterSchema = z.object();

const baseNodeSchema = z.object({
  id: z.string(),
  name: z.string(), // No longer needed at the top level/
  description: z.string().optional(),
  position: z.object({x: z.number(), y: z.number()}),
  // data: z.object({label: z.string()}).optional(), //was using for reactflow's node structure.
  disabled: z.boolean().optional(),
  parameters: parameterSchema.optional(),
});

const triggerNodeSchema = baseNodeSchema.extend({
  type: z.literal(NODE_TYPE.trigger),
  kind: z.enum(Object.values(TRIGGER_KIND) as [string, ...string[]]),
});

const actionNodeSchema = baseNodeSchema.extend({
  type: z.literal(NODE_TYPE.action),
  kind: z.enum(Object.values(ACTION_KIND) as [string, ...string[]]),
});

const nodeSchema = z.discriminatedUnion('type', [
  triggerNodeSchema,
  actionNodeSchema,
]);

// dropped schema
// const connectionTargetSchema = z.object({
//   node: z.string(),
//   input: z.string(),
// });

// const connectionsSchema = z.record( 
//   z.string(),                    
//   z.object({                      
//     main: z.array(connectionTargetSchema)
//   })
// );

export const connectionSchema = z.object({
  id: z.string(),
  source: z.string(),
  sourceHandle: z.string().optional(),
  target: z.string(),
  targetHandle: z.string().optional()
})


export const createWorkflowBodySchema = z.object({
  name: z.string().min(1, 'Workflow name cannot be empty.'),
  description: z.string().optional(),
  nodes: z.array(nodeSchema),
  connections: z.array(connectionSchema),
});

// Schemas for Credentials
const telegramCredentialSchema = z.object({
  type: z.literal(Credentials.telegram),
  name: z.string().min(1, 'Credential name cannot be empty.'),
  data: z.object({
    botToken: z.string().min(1, 'Bot token is required.'),
  }),
});

const emailCredentialSchema = z.object({
  type: z.literal(Credentials.email),
  name: z.string().min(1, 'Credential name cannot be empty.'),
  data: z.object({
    apiKey: z.string().min(1, 'API key is required.'),
  }),
});

export const createCredentialBodySchema = z.discriminatedUnion('type', [
  telegramCredentialSchema,
  emailCredentialSchema,
]);
