import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Draft } from 'immer';
import {
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import type { NodeData } from '@/types/workflow';

interface GraphSnapshot {
  nodes: Node<NodeData>[];
  edges: Edge[];
}

const HISTORY_LIMIT = 100;

function cloneGraph(nodes: Node<NodeData>[], edges: Edge[]): GraphSnapshot {
  return {
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges)),
  };
}

function pushHistory(state: Draft<WorkflowState>) {
  state.past.push(cloneGraph(state.nodes, state.edges));
  if (state.past.length > HISTORY_LIMIT) {
    state.past.shift();
  }
  state.future = [];
}

/** Shape of the entire workflow store — state + actions. */
interface WorkflowState {
  /* ── Reactive State ─────────────────────────────────── */
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  past: GraphSnapshot[];
  future: GraphSnapshot[];

  /* ── React Flow Handlers ────────────────────────────── */
  onNodesChange: (changes: NodeChange<Node<NodeData>>[]) => void;
  onEdgesChange: (changes: EdgeChange<Edge>[]) => void;
  onConnect: (connection: Connection) => void;

  /* ── Custom Actions ─────────────────────────────────── */
  addNode: (node: Node<NodeData>) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  setSelectedNode: (id: string | null) => void;
  deleteSelectedElements: () => void;
  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
  importGraph: (nodes: Node<NodeData>[], edges: Edge[]) => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  immer((set) => ({
    /* ── Initial State ──────────────────────────────────── */
    nodes: [],
    edges: [],
    selectedNodeId: null,
    past: [],
    future: [],

    /* ── React Flow Handlers ────────────────────────────── */
    onNodesChange: (changes) => {
      set((state) => {
        const hasStructuralChange = changes.some(
          (change) =>
            change.type === 'remove' ||
            change.type === 'add' ||
            change.type === 'replace'
        );

        if (hasStructuralChange) {
          pushHistory(state);
        }

        state.nodes = applyNodeChanges<Node<NodeData>>(changes, state.nodes);

        if (
          state.selectedNodeId &&
          !state.nodes.some((node) => node.id === state.selectedNodeId)
        ) {
          state.selectedNodeId = null;
        }
      });
    },

    onEdgesChange: (changes) => {
      set((state) => {
        const hasStructuralChange = changes.some(
          (change) =>
            change.type === 'remove' ||
            change.type === 'add' ||
            change.type === 'replace'
        );

        if (hasStructuralChange) {
          pushHistory(state);
        }

        state.edges = applyEdgeChanges(changes, state.edges);
      });
    },

    onConnect: (connection) => {
      set((state) => {
        pushHistory(state);
        state.edges = addEdge({ ...connection, type: 'custom' }, state.edges);
      });
    },

    /* ── Custom Actions ─────────────────────────────────── */
    addNode: (node) => {
      set((state) => {
        pushHistory(state);
        state.nodes.push(node);
      });
    },

    updateNodeData: (id, data) => {
      set((state) => {
        const node = state.nodes.find((n) => n.id === id);
        if (node) {
          Object.assign(node.data, data);
        }
      });
    },

    setSelectedNode: (id) => {
      set((state) => {
        state.selectedNodeId = id;
      });
    },

    deleteSelectedElements: () => {
      set((state) => {
        const selectedNodeIds = new Set(
          state.nodes.filter((node) => node.selected).map((node) => node.id)
        );
        const hasSelectedNodes = selectedNodeIds.size > 0;
        const hasSelectedEdges = state.edges.some((edge) => edge.selected);

        if (!hasSelectedNodes && !hasSelectedEdges) {
          return;
        }

        pushHistory(state);

        state.nodes = state.nodes.filter((node) => !selectedNodeIds.has(node.id));
        state.edges = state.edges.filter(
          (edge) =>
            !edge.selected &&
            !selectedNodeIds.has(edge.source) &&
            !selectedNodeIds.has(edge.target)
        );

        if (state.selectedNodeId && selectedNodeIds.has(state.selectedNodeId)) {
          state.selectedNodeId = null;
        }
      });
    },

    deleteNode: (id) => {
      set((state) => {
        const nodeExists = state.nodes.some((node) => node.id === id);
        if (!nodeExists) {
          return;
        }

        pushHistory(state);

        state.nodes = state.nodes.filter((n) => n.id !== id);
        state.edges = state.edges.filter((e) => e.source !== id && e.target !== id);

        if (state.selectedNodeId === id) {
          state.selectedNodeId = null;
        }
      });
    },

    deleteEdge: (id) => {
      set((state) => {
        const edgeExists = state.edges.some((edge) => edge.id === id);
        if (!edgeExists) {
          return;
        }

        pushHistory(state);
        state.edges = state.edges.filter((edge) => edge.id !== id);
      });
    },

    undo: () => {
      set((state) => {
        const previous = state.past.pop();
        if (!previous) {
          return;
        }

        state.future.push(cloneGraph(state.nodes, state.edges));
        state.nodes = previous.nodes;
        state.edges = previous.edges;
        state.selectedNodeId = null;
      });
    },

    redo: () => {
      set((state) => {
        const next = state.future.pop();
        if (!next) {
          return;
        }

        state.past.push(cloneGraph(state.nodes, state.edges));
        state.nodes = next.nodes;
        state.edges = next.edges;
        state.selectedNodeId = null;
      });
    },

    clearCanvas: () => {
      set((state) => {
        if (state.nodes.length === 0 && state.edges.length === 0) {
          return;
        }

        pushHistory(state);
        state.nodes = [];
        state.edges = [];
        state.selectedNodeId = null;
      });
    },

    importGraph: (nodes, edges) => {
      set((state) => {
        pushHistory(state);
        state.nodes = structuredClone(nodes);
        state.edges = structuredClone(edges);
        state.selectedNodeId = null;
      });
    },
  }))
);
