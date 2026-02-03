export type NodeType =
  | "start"
  | "message"
  | "condition"
  | "api"
  | "dtmf"
  | "transfer" 
  | "assistant" 
  | "wait" 
  | "variable" 
  | "end";

export interface FlowNodePosition {
  x: number;
  y: number;
}

export interface DTMFOption {
  key: string;
  label: string;
  nextNodeId?: string;
}

export interface ConditionBranch {
  id: string;
  label: string;
  expression: string;
  nextNodeId?: string;
}

export interface APICallConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  headers: Record<string, string>;
  body?: string;
  responseVariable?: string;
  timeout?: number;
}

export interface AssistantConfig {
  assistantId: string;
  systemPrompt?: string;
  maxTurns?: number;
  temperature?: number;
}

export interface MessageConfig {
  content: string;
  voice?: string;
  language?: string;
  ssml?: boolean;
}

export interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  position: FlowNodePosition;
  data: {
    message?: MessageConfig;
    conditions?: ConditionBranch[];
    api?: APICallConfig;
    dtmf?: {
      prompt: string;
      options: DTMFOption[];
      timeout?: number;
      retries?: number;
    };
    assistant?: AssistantConfig;
    variable?: {
      name: string;
      value: string;
    };
    waitDuration?: number;
  };
  connections: {
    id: string;
    targetNodeId: string;
    label?: string;
  }[];
}

export interface FlowVersion {
  id: string;
  version: string;
  createdAt: string;
  createdBy: string;
  notes?: string;
  nodeCount: number;
}

export interface Flow {
  id: string;
  name: string;
  description?: string;
  status: "draft" | "published" | "testing" | "archived";
  currentVersion: string;
  versions: FlowVersion[];
  nodes: FlowNode[];
  createdAt: string;
  updatedAt: string;
  clientId?: string;
  clientName?: string;
  tags?: string[];
}

export interface FlowTestMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  nodeId?: string;
  dtmfInput?: string;
}

export interface FlowTestSession {
  id: string;
  flowId: string;
  status: "running" | "completed" | "failed";
  messages: FlowTestMessage[];
  currentNodeId: string;
  startedAt: string;
  endedAt?: string;
  variables: Record<string, string>;
}
