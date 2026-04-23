import { DraggableSidebar } from '@/features/workflow-canvas/DraggableSidebar';
import { CanvasHeader } from '@/features/workflow-canvas/CanvasHeader';
import { WorkflowCanvas } from '@/features/workflow-canvas/WorkflowCanvas';
import { ConfigPanel } from '@/features/workflow-forms/ConfigPanel';

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <CanvasHeader />

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
