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
}

export interface TaskNodeData extends BaseNodeData {
  type: 'task';
  description?: string;
  assignee?: string;
  dueDate?: string;
}

export interface ApprovalNodeData extends BaseNodeData {
  type: 'approval';
  role?: string;
  threshold?: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  type: 'automated';
  actionId?: string;
}

export interface EndNodeData extends BaseNodeData {
  type: 'end';
  endMessage?: string;
}

export type NodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData
  | BaseNodeData;

export interface SimulationStep {
  stepId: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  timestamp: string;
}

export interface SimulationResponse {
  success: boolean;
  steps: SimulationStep[];
}
