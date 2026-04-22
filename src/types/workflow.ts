export interface ActionTemplate {
  id: string;
  label: string;
  params: string[];
}

export interface BaseNodeData {
  title: string;
  [key: string]: unknown;
}

export interface StartNodeData extends BaseNodeData {
  type: 'start';
  metadata?: { key: string; value: string }[];
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: { key: string; value: string }[];
}

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  role?: string;
  threshold?: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  type: 'automated';
  actionId?: string;
  params?: Record<string, string>;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
  endMessage?: string;
  summary?: boolean;
}

export type NodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export interface SimulationStep {
  stepId: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  timestamp: string;
}

export interface SimulationResponse {
  success: boolean;
  steps: SimulationStep[];
  error?: string;
}
