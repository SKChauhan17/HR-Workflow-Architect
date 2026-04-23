'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import {
  Download,
  Upload,
  Undo2,
  Redo2,
  Trash2,
  Moon,
  Sun,
} from 'lucide-react';
import type { Edge, Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { SandboxModal } from '@/features/workflow-sandbox/SandboxModal';
import type { NodeData } from '@/types/workflow';

interface WorkflowPayload {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isWorkflowPayload(value: unknown): value is WorkflowPayload {
  if (!isRecord(value)) {
    return false;
  }

  const { nodes, edges } = value;
  return Array.isArray(nodes) && Array.isArray(edges);
}

export function CanvasHeader() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const pastLength = useWorkflowStore((s) => s.past.length);
  const futureLength = useWorkflowStore((s) => s.future.length);
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);
  const clearCanvas = useWorkflowStore((s) => s.clearCanvas);
  const importGraph = useWorkflowStore((s) => s.importGraph);

  const hasGraphData = nodes.length > 0 || edges.length > 0;
  const isDark = resolvedTheme === 'dark';

  function handleExport() {
    const payload: WorkflowPayload = { nodes, edges };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const fileText = await file.text();
      const parsed: unknown = JSON.parse(fileText);

      if (!isWorkflowPayload(parsed)) {
        throw new Error('Invalid workflow JSON format');
      }

      importGraph(parsed.nodes, parsed.edges);
      toast.success('Workflow imported successfully');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to import workflow JSON';
      toast.error(message);
    } finally {
      event.target.value = '';
    }
  }

  function handleClearCanvas() {
    clearCanvas();
    toast.success('Canvas cleared');
  }

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark');
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 text-foreground">
      <div className="flex items-center gap-2.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 text-blue-500">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.5" y1="10.5" x2="15.5" y2="6.5" />
          <line x1="8.5" y1="13.5" x2="15.5" y2="17.5" />
        </svg>
        <div>
          <h1 className="text-sm font-semibold text-foreground">HR Workflow Architect</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={undo}
            disabled={pastLength === 0}
          >
            <Undo2 className="h-3.5 w-3.5" />
            Undo
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={redo}
            disabled={futureLength === 0}
          >
            <Redo2 className="h-3.5 w-3.5" />
            Redo
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 border border-red-200 bg-red-50 text-red-700 shadow-sm hover:border-red-300 hover:bg-red-100 hover:text-red-800 dark:border-red-400/40 dark:bg-red-500/25 dark:text-red-50 dark:hover:border-red-300 dark:hover:bg-red-500/35 dark:hover:text-white"
            onClick={handleClearCanvas}
            disabled={!hasGraphData}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Canvas
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          onClick={handleExport}
          disabled={!hasGraphData}
        >
          <Download className="h-3.5 w-3.5" />
          Export JSON
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          onClick={handleImportClick}
        >
          <Upload className="h-3.5 w-3.5" />
          Import JSON
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleImport}
        />

        <SandboxModal />

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {mounted ? (isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <div className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
