'use client';

import {
  createContext,
  memo,
  useContext,
  useMemo,
  type CSSProperties,
} from 'react';
import {
  MiniMap,
  type Edge,
  type MiniMapNodeProps,
  type Node,
} from '@xyflow/react';
import { useTheme } from 'next-themes';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import type { NodeData } from '@/types/workflow';

const MINI_MAP_WIDTH = 160;
const MINI_MAP_HEIGHT = 120;

interface MiniMapLayoutEntry {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

interface MiniMapLayoutContextValue {
  layoutById: Map<string, MiniMapLayoutEntry>;
  outgoingEdgesBySource: Map<string, Edge[]>;
  edgeStroke: string;
}

const MiniMapLayoutContext = createContext<MiniMapLayoutContextValue | null>(null);

const NODE_DIMENSIONS: Record<NodeData['type'], { width: number; height: number }> = {
  start: { width: 200, height: 104 },
  task: { width: 240, height: 124 },
  approval: { width: 240, height: 124 },
  automated: { width: 240, height: 124 },
  end: { width: 200, height: 104 },
};

function getNodeDimensions(node: Node<NodeData>) {
  const fallback = NODE_DIMENSIONS[node.type as NodeData['type']] ?? NODE_DIMENSIONS.task;
  return {
    width: node.width ?? fallback.width,
    height: node.height ?? fallback.height,
  };
}

function getNodePosition(node: Node<NodeData>) {
  const position = node.positionAbsolute ?? node.position;

  return {
    x: position.x,
    y: position.y,
  };
}

function useMiniMapLayout(nodes: Node<NodeData>[], edges: Edge[]) {
  return useMemo(() => {
    const layoutById = new Map<string, MiniMapLayoutEntry>();

    nodes.forEach((node) => {
      const { x, y } = getNodePosition(node);
      const { width, height } = getNodeDimensions(node);

      layoutById.set(node.id, {
        x,
        y,
        width,
        height,
        centerX: x + width / 2,
        centerY: y + height / 2,
      });
    });

    const outgoingEdgesBySource = edges.reduce((accumulator, edge) => {
      const existing = accumulator.get(edge.source) ?? [];
      accumulator.set(edge.source, [...existing, edge]);
      return accumulator;
    }, new Map<string, Edge[]>());

    return {
      layoutById,
      outgoingEdgesBySource,
    };
  }, [edges, nodes]);
}

function MiniMapNodeComponent({
  id,
  x,
  y,
  width,
  height,
  borderRadius,
  className,
  color,
  strokeColor,
  strokeWidth,
  selected,
  style,
}: MiniMapNodeProps) {
  const context = useContext(MiniMapLayoutContext);

  if (!context) {
    return null;
  }

  const outgoingEdges = context.outgoingEdgesBySource.get(id) ?? [];
  const sourceX = x + width;
  const sourceY = y + height / 2;

  return (
    <g>
      {outgoingEdges.map((edge) => {
        const target = context.layoutById.get(edge.target);

        if (!target) {
          return null;
        }

        return (
          <line
            key={edge.id}
            x1={sourceX}
            y1={sourceY}
            x2={target.x}
            y2={target.centerY}
            stroke={context.edgeStroke}
            strokeWidth={2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={0.85}
            pointerEvents="none"
          />
        );
      })}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={borderRadius}
        ry={borderRadius}
        fill={color ?? '#e2e2e2'}
        stroke={strokeColor ?? 'transparent'}
        strokeWidth={strokeWidth ?? 1}
        className={className}
        style={style as CSSProperties}
        opacity={selected ? 1 : 0.95}
      />
    </g>
  );
}

const MiniMapNode = memo(MiniMapNodeComponent);

function getMiniMapNodeColor(node: Node<NodeData>): string {
  if (node.type === 'start') return '#22c55e';
  if (node.type === 'task') return '#3b82f6';
  if (node.type === 'approval') return '#f59e0b';
  if (node.type === 'automated') return '#a855f7';
  return '#94a3b8';
}

export function WorkflowMiniMap() {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const { resolvedTheme } = useTheme();

  const { layoutById, outgoingEdgesBySource } = useMiniMapLayout(nodes, edges);
  const edgeStroke =
    resolvedTheme === 'dark' ? 'rgba(226, 232, 240, 0.28)' : 'rgba(24, 29, 38, 0.18)';
  const nodeStrokeColor =
    resolvedTheme === 'dark' ? 'rgba(226, 232, 240, 0.35)' : 'rgba(24, 29, 38, 0.08)';

  return (
    <MiniMapLayoutContext.Provider
      value={{ layoutById, outgoingEdgesBySource, edgeStroke }}
    >
      <MiniMap
        position="bottom-right"
        pannable
        zoomable
        ariaLabel="Workflow overview"
        nodeBorderRadius={4}
        nodeColor={getMiniMapNodeColor}
        nodeStrokeColor={() => nodeStrokeColor}
        nodeStrokeWidth={1}
        nodeComponent={MiniMapNode}
        maskColor={resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.78)' : 'rgba(0, 0, 0, 0.14)'}
        maskStrokeColor={resolvedTheme === 'dark' ? 'rgba(248, 250, 252, 0.35)' : 'rgba(24, 29, 38, 0.22)'}
        maskStrokeWidth={1.25}
        className="bg-background border border-border shadow-sm"
        style={{ height: MINI_MAP_HEIGHT, width: MINI_MAP_WIDTH }}
      />
    </MiniMapLayoutContext.Provider>
  );
}