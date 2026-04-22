import { DraggableSidebar } from '@/features/workflow-canvas/DraggableSidebar';
import { WorkflowCanvas } from '@/features/workflow-canvas/WorkflowCanvas';
import { ConfigPanel } from '@/features/workflow-forms/ConfigPanel';

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* ── Left Column: Node Palette ─────────────────── */}
      <DraggableSidebar />

      {/* ── Center Column: Interactive Canvas ─────────── */}
      <main className="flex-1 overflow-hidden">
        <WorkflowCanvas />
      </main>

      {/* ── Right Column: Config Panel ────────────────── */}
      <ConfigPanel />
    </div>
  );
}
