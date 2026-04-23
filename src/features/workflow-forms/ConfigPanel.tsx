'use client';

import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { StartNodeForm } from './components/StartNodeForm';
import { TaskNodeForm } from './components/TaskNodeForm';
import { ApprovalNodeForm } from './components/ApprovalNodeForm';
import { AutomatedNodeForm } from './components/AutomatedNodeForm';
import { EndNodeForm } from './components/EndNodeForm';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from '@/types/workflow';

export function ConfigPanel() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // If no node selected, show the empty state
  if (!selectedNodeId || !selectedNode) {
    return (
      <aside className="relative flex h-full w-80 shrink-0 flex-col border-l border-border bg-background text-foreground">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shadow-sm">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-[13px] font-semibold text-foreground">Configuration</h2>
            <p className="text-[11px] text-muted-foreground leading-tight">Select a node to configure</p>
          </div>
        </div>

        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">No Node Selected</p>
              <p className="mt-1 max-w-[200px] text-xs leading-relaxed text-muted-foreground">
                Click a node on the canvas or drag one from the palette to get started.
              </p>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Render the appropriate form based on node type
  // React Flow's node.type is string | undefined, so we cast data explicitly
  // in each branch where the type match guarantees the correct shape.
  let FormComponent = null;
  const nodeType = selectedNode.type;

  switch (nodeType) {
    case 'start':
      FormComponent = <StartNodeForm key={selectedNode.id} nodeId={selectedNode.id} defaultValues={selectedNode.data as StartNodeData} />;
      break;
    case 'task':
      FormComponent = <TaskNodeForm key={selectedNode.id} nodeId={selectedNode.id} defaultValues={selectedNode.data as TaskNodeData} />;
      break;
    case 'approval':
      FormComponent = <ApprovalNodeForm key={selectedNode.id} nodeId={selectedNode.id} defaultValues={selectedNode.data as ApprovalNodeData} />;
      break;
    case 'automated':
      FormComponent = <AutomatedNodeForm key={selectedNode.id} nodeId={selectedNode.id} defaultValues={selectedNode.data as AutomatedNodeData} />;
      break;
    case 'end':
      FormComponent = <EndNodeForm key={selectedNode.id} nodeId={selectedNode.id} defaultValues={selectedNode.data as EndNodeData} />;
      break;
    default:
      FormComponent = <p className="text-sm text-muted-foreground">Unknown node type: {nodeType}</p>;
  }

  return (
    <aside className="relative z-10 flex h-full w-80 shrink-0 flex-col border-l border-border bg-background text-foreground">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shadow-sm">
          <Settings className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="px-1 text-[13px] font-semibold capitalize text-foreground">{nodeType} Node</h2>
          <p className="px-1 text-[11px] leading-tight text-muted-foreground">ID: {selectedNode.id.split('_').pop() || selectedNode.id}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {FormComponent}
        </div>
      </div>

      <div className="mt-auto border-t border-border bg-muted p-4">
        <Button 
          variant="destructive" 
          className="w-full gap-2 border border-red-200 bg-red-50 text-red-700 shadow-sm hover:border-red-300 hover:bg-red-100 dark:border-red-400/40 dark:bg-red-500/25 dark:text-red-50 dark:hover:border-red-300 dark:hover:bg-red-500/35 text-xs"
          size="sm"
          onClick={() => deleteNode(selectedNodeId)}
        >
          <Trash2 className="w-4 h-4" />
          Delete Node
        </Button>
      </div>
    </aside>
  );
}
