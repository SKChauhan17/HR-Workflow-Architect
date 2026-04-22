import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '@/types/workflow';

/** Result shape returned by the graph validator. */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates the structural integrity of a workflow graph.
 *
 * Checks performed:
 *  1. Empty graph detection
 *  2. Exactly one Start node, at least one End node
 *  3. Disconnected nodes (missing incoming/outgoing edges)
 *  4. Cycle detection via iterative DFS
 */
export function validateGraph(
  nodes: Node<NodeData>[],
  edges: Edge[]
): ValidationResult {
  const errors: string[] = [];

  /* ── 1. Empty Graph ──────────────────────────────────── */
  if (nodes.length === 0) {
    errors.push('The workflow graph is empty. Add at least one node.');
    return { isValid: false, errors };
  }

  /* ── 2. Missing Start / End ──────────────────────────── */
  const startNodes = nodes.filter((n) => n.type === 'start');
  const endNodes = nodes.filter((n) => n.type === 'end');

  if (startNodes.length === 0) {
    errors.push('Missing a Start node. Every workflow must have exactly one Start node.');
  } else if (startNodes.length > 1) {
    errors.push(
      `Found ${startNodes.length} Start nodes. A workflow must have exactly one.`
    );
  }

  if (endNodes.length === 0) {
    errors.push('Missing an End node. Every workflow must have at least one End node.');
  }

  /* ── 3. Disconnected Nodes ───────────────────────────── */
  const incomingMap = new Map<string, number>();
  const outgoingMap = new Map<string, number>();

  // Initialize counts
  for (const node of nodes) {
    incomingMap.set(node.id, 0);
    outgoingMap.set(node.id, 0);
  }

  // Tally edges
  for (const edge of edges) {
    incomingMap.set(edge.target, (incomingMap.get(edge.target) ?? 0) + 1);
    outgoingMap.set(edge.source, (outgoingMap.get(edge.source) ?? 0) + 1);
  }

  for (const node of nodes) {
    const incoming = incomingMap.get(node.id) ?? 0;
    const outgoing = outgoingMap.get(node.id) ?? 0;
    const label = node.data.title || node.id;

    // Every non-start node must have at least one incoming edge
    if (node.type !== 'start' && incoming === 0) {
      errors.push(
        `Node "${label}" has no incoming connections. It will never be reached.`
      );
    }

    // Every non-end node must have at least one outgoing edge
    if (node.type !== 'end' && outgoing === 0) {
      errors.push(
        `Node "${label}" has no outgoing connections. The workflow will dead-end here.`
      );
    }
  }

  /* ── 4. Cycle Detection (Iterative DFS) ──────────────── */
  if (hasCycle(nodes, edges)) {
    errors.push(
      'A cycle (infinite loop) was detected in the workflow. Remove circular connections.'
    );
  }

  return { isValid: errors.length === 0, errors };
}

/* ------------------------------------------------------------------ */
/*  Cycle detection using iterative DFS with 3-state coloring         */
/*  WHITE = unvisited, GRAY = in current path, BLACK = fully explored */
/* ------------------------------------------------------------------ */

enum Color {
  WHITE = 0,
  GRAY = 1,
  BLACK = 2,
}

function hasCycle(nodes: Node<NodeData>[], edges: Edge[]): boolean {
  // Build adjacency list
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) {
    adjacency.set(node.id, []);
  }
  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
  }

  const color = new Map<string, Color>();
  for (const node of nodes) {
    color.set(node.id, Color.WHITE);
  }

  for (const node of nodes) {
    if (color.get(node.id) !== Color.WHITE) continue;

    // Iterative DFS with explicit stack
    const stack: { id: string; childIndex: number }[] = [
      { id: node.id, childIndex: 0 },
    ];
    color.set(node.id, Color.GRAY);

    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const neighbors = adjacency.get(frame.id) ?? [];

      if (frame.childIndex < neighbors.length) {
        const neighbor = neighbors[frame.childIndex];
        frame.childIndex += 1;

        const neighborColor = color.get(neighbor);

        if (neighborColor === Color.GRAY) {
          // Back-edge detected → cycle
          return true;
        }

        if (neighborColor === Color.WHITE) {
          color.set(neighbor, Color.GRAY);
          stack.push({ id: neighbor, childIndex: 0 });
        }
        // BLACK neighbors are already fully explored — skip
      } else {
        // All children explored
        color.set(frame.id, Color.BLACK);
        stack.pop();
      }
    }
  }

  return false;
}
