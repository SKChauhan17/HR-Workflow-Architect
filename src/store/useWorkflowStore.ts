import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
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

/** Shape of the entire workflow store — state + actions. */
interface WorkflowState {
  /* ── Reactive State ─────────────────────────────────── */
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;

  /* ── React Flow Handlers ────────────────────────────── */
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  /* ── Custom Actions ─────────────────────────────────── */
  addNode: (node: Node<NodeData>) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  setSelectedNode: (id: string | null) => void;
  deleteSelectedElements: () => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  immer((set) => ({
    /* ── Initial State ──────────────────────────────────── */
    nodes: [],
    edges: [],
    selectedNodeId: null,

    /* ── React Flow Handlers ────────────────────────────── */
    onNodesChange: (changes) => {
      set((state) => {
        state.nodes = applyNodeChanges(changes, state.nodes) as Node<NodeData>[];
      });
    },

    onEdgesChange: (changes) => {
      set((state) => {
        state.edges = applyEdgeChanges(changes, state.edges);
      });
    },

    onConnect: (connection) => {
      set((state) => {
        state.edges = addEdge(connection, state.edges);
      });
    },

    /* ── Custom Actions ─────────────────────────────────── */
    addNode: (node) => {
      set((state) => {
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
        state.nodes = state.nodes.filter((node) => !node.selected);
        state.edges = state.edges.filter((edge) => !edge.selected);
      });
    },
  }))
);
