import { DraggableSidebar } from '@/features/workflow-canvas/DraggableSidebar';
import { WorkflowCanvas } from '@/features/workflow-canvas/WorkflowCanvas';
import { Settings } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* ── Left Column: Node Palette ─────────────────── */}
      <DraggableSidebar />

      {/* ── Center Column: Interactive Canvas ─────────── */}
      <main className="flex-1 overflow-hidden">
        <WorkflowCanvas />
      </main>

      {/* ── Right Column: Config Panel Placeholder ────── */}
      <aside className="flex w-80 shrink-0 flex-col border-l border-border bg-white">
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 shadow-sm">
            <Settings className="h-4 w-4 text-slate-500" />
          </div>
          <div>
            <h2 className="text-[13px] font-semibold text-slate-900">
              Configuration
            </h2>
            <p className="text-[11px] text-slate-500 leading-tight">
              Select a node to configure
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                No Node Selected
              </p>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed max-w-[200px]">
                Click a node on the canvas or drag one from the palette to get started.
              </p>
            </div>
            <span className="mt-2 inline-flex items-center rounded-full border border-[#e0e2e6] bg-white px-3 py-1 text-[11px] font-medium text-muted-foreground">
              Phase 5
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
