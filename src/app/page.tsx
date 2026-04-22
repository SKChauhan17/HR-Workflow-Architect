import { DraggableSidebar } from '@/features/workflow-canvas/DraggableSidebar';
import { WorkflowCanvas } from '@/features/workflow-canvas/WorkflowCanvas';
import { ConfigPanel } from '@/features/workflow-forms/ConfigPanel';
import { SandboxModal } from '@/features/workflow-sandbox/SandboxModal';
import { Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white">
      {/* ── Top Header Bar ──────────────────────────────── */}
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-white px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1b61c9]">
            <Zap className="h-3 w-3 text-white" />
          </div>
          <span className="text-[13px] font-semibold text-slate-900">
            HR Workflow Designer
          </span>
          <span className="rounded-full border border-border bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-400">
            v0.6
          </span>
        </div>

        <div className="flex items-center gap-2">
          <SandboxModal />
        </div>
      </header>

      {/* ── 3-Column Workspace ─────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Node Palette */}
        <DraggableSidebar />

        {/* Center Column: Interactive Canvas */}
        <main className="flex-1 overflow-hidden">
          <WorkflowCanvas />
        </main>

        {/* Right Column: Config Panel */}
        <ConfigPanel />
      </div>
    </div>
  );
}
