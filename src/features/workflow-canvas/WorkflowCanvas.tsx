'use client';

import { useCallback, useRef, type DragEvent } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '@/store/useWorkflowStore';
import { StartNode } from './nodes/StartNode';
import { TaskNode } from './nodes/TaskNode';
import { ApprovalNode } from './nodes/ApprovalNode';
import { AutomatedNode } from './nodes/AutomatedNode';
import { EndNode } from './nodes/EndNode';
import type { NodeData } from '@/types/workflow';

/**
 * Registered OUTSIDE the component render cycle to prevent remounting.
 * Maps node type identifiers → custom React components.
 */
const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
} as const;

/** Default data payloads seeded when a node is first dropped on the canvas. */
const DEFAULT_NODE_DATA: Record<string, NodeData> = {
  start: { type: 'start', title: 'Start' },
  task: { type: 'task', title: 'New Task', assignee: '', dueDate: '' },
  approval: { type: 'approval', title: 'Approval Gate', role: '' },
  automated: { type: 'automated', title: 'Automation', actionId: '' },
  end: { type: 'end', title: 'End', endMessage: '' },
};

/** Generate a unique ID for new nodes. */
let nodeIdCounter = 0;
function generateNodeId(): string {
  nodeIdCounter += 1;
  return `node_${Date.now()}_${nodeIdCounter}`;
}

/* ------------------------------------------------------------------ */
/*  Inner canvas — needs to live inside <ReactFlowProvider>           */
/* ------------------------------------------------------------------ */
function CanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const onConnect = useWorkflowStore((s) => s.onConnect);
  const addNode = useWorkflowStore((s) => s.addNode);
  const setSelectedNode = useWorkflowStore((s) => s.setSelectedNode);

  /** Allow drop by preventing the default browser behavior. */
  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /** Extract the node type from the drag event and add the node at drop coordinates. */
  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !(type in DEFAULT_NODE_DATA)) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node<NodeData> = {
        id: generateNodeId(),
        type,
        position,
        data: { ...DEFAULT_NODE_DATA[type] },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  /** Track which node is selected. */
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<NodeData>) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  /** Deselect node on pane click. */
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div ref={reactFlowWrapper} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-[#f8fafc]"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e0e2e6"
        />
        <Controls
          className="!rounded-xl !border !border-[#e0e2e6] !shadow-sm"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Public wrapper — provides the ReactFlowProvider context           */
/* ------------------------------------------------------------------ */
export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
