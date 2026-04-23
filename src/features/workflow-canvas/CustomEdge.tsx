'use client';

import { memo, type MouseEvent } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import { X } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';

function CustomEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps) {
  const deleteEdge = useWorkflowStore((s) => s.deleteEdge);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    deleteEdge(id);
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: '#6366f1', strokeWidth: 2.5 }}
      />

      <EdgeLabelRenderer>
        <div
          className="absolute pointer-events-none"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <button
            type="button"
            aria-label="Delete edge"
            onClick={handleDelete}
            className="pointer-events-auto inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white dark:border-border dark:bg-background dark:text-muted-foreground dark:hover:border-red-300 dark:hover:bg-red-400 dark:hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export const CustomEdge = memo(CustomEdgeComponent);
