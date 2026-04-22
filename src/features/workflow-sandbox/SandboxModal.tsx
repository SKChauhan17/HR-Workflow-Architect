'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Play, Loader2, FlaskConical, RotateCcw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { validateGraph } from '@/lib/graphValidation';
import { ExecutionTimeline } from './ExecutionTimeline';
import type { SimulationResponse, SimulationStep } from '@/types/workflow';

async function postSimulation(payload: {
  nodes: unknown[];
  edges: unknown[];
}): Promise<SimulationResponse> {
  const res = await fetch('/api/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    let errorMessage = `Simulation failed with status ${res.status}`;
    try {
      const errorData = JSON.parse(text);
      if (errorData && errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return res.json() as Promise<SimulationResponse>;
}

export function SandboxModal() {
  const [open, setOpen] = useState(false);
  const [steps, setSteps] = useState<SimulationStep[]>([]);

  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  const mutation = useMutation({
    mutationFn: postSimulation,
    onSuccess: (data) => {
      setSteps(data.steps);
      if (data.success) {
        toast.success('Simulation completed successfully');
      } else {
        toast.warning('Simulation completed with failures');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function handleSimulate() {
    // Reset previous results
    setSteps([]);

    // ── Validation Phase ──────────────────────────────
    const result = validateGraph(nodes, edges);

    if (!result.isValid) {
      for (const error of result.errors) {
        toast.error(error);
      }
      return;
    }

    // ── Execution Phase ───────────────────────────────
    mutation.mutate({ nodes, edges });
  }

  function handleReset() {
    setSteps([]);
    mutation.reset();
  }

  const hasResults = steps.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Play className="h-3.5 w-3.5" />
          Test Workflow
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            Execution Sandbox
          </DialogTitle>
          <DialogDescription>
            Validate the workflow graph and simulate a step-by-step execution run.
          </DialogDescription>
        </DialogHeader>

        {/* ── Results Area ──────────────────────────────── */}
        {hasResults && (
          <ScrollArea className="max-h-[360px] pr-3">
            <ExecutionTimeline steps={steps} />
          </ScrollArea>
        )}

        {!hasResults && !mutation.isPending && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <FlaskConical className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                Ready to Simulate
              </p>
              <p className="mt-1 max-w-[240px] text-xs text-slate-400 leading-relaxed">
                The graph will be validated for structural integrity, then
                executed step-by-step through the simulation API.
              </p>
            </div>
          </div>
        )}

        {mutation.isPending && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-slate-500">Running simulation…</p>
          </div>
        )}

        {/* ── Actions ──────────────────────────────────── */}
        <DialogFooter>
          {hasResults && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSimulate}
            disabled={mutation.isPending}
            className="gap-1.5"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Running…
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Run Simulation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
