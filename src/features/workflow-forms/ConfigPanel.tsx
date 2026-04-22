'use client';

import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import { StartNodeForm } from './components/StartNodeForm';
import { TaskNodeForm } from './components/TaskNodeForm';
import { ApprovalNodeForm } from './components/ApprovalNodeForm';
import { AutomatedNodeForm } from './components/AutomatedNodeForm';
import { EndNodeForm } from './components/EndNodeForm';

export function ConfigPanel() {
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // If no node selected, show the empty state
  if (!selectedNodeId || !selectedNode) {
    return (
      <aside className="flex w-80 shrink-0 flex-col border-l border-border bg-white h-full relative">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 shadow-sm">
            <Settings className="h-4 w-4 text-slate-500" />
          </div>
          <div>
            <h2 className="text-[13px] font-semibold text-slate-900">Configuration</h2>
            <p className="text-[11px] text-slate-500 leading-tight">Select a node to configure</p>
          </div>
        </div>

        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">No Node Selected</p>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed max-w-[200px]">
                Click a node on the canvas or drag one from the palette to get started.
              </p>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Render the appropriate form based on node type
  let FormComponent = null;
  const nodeType = selectedNode.type;

  switch (nodeType) {
    case 'start':
      FormComponent = <StartNodeForm nodeId={selectedNode.id} defaultValues={selectedNode.data} />;
      break;
    case 'task':
      FormComponent = <TaskNodeForm nodeId={selectedNode.id} defaultValues={selectedNode.data} />;
      break;
    case 'approval':
      FormComponent = <ApprovalNodeForm nodeId={selectedNode.id} defaultValues={selectedNode.data} />;
      break;
    case 'automated':
      FormComponent = <AutomatedNodeForm nodeId={selectedNode.id} defaultValues={selectedNode.data} />;
      break;
    case 'end':
      FormComponent = <EndNodeForm nodeId={selectedNode.id} defaultValues={selectedNode.data} />;
      break;
    default:
      FormComponent = <p className="text-sm text-muted-foreground">Unknown node type: {nodeType}</p>;
  }

  return (
    <aside className="flex w-80 shrink-0 flex-col border-l border-border bg-white h-[100vh] relative z-10">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shadow-sm">
          <Settings className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900 capitalize px-1">{nodeType} Node</h2>
          <p className="text-[11px] text-slate-500 leading-tight px-1">ID: {selectedNode.id.split('_').pop() || selectedNode.id}</p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {FormComponent}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-slate-50/50 mt-auto">
        <Button 
          variant="destructive" 
          className="w-full shadow-none gap-2 text-xs" 
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
