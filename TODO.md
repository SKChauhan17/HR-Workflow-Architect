# HR Workflow Architect - Next.js Enterprise Implementation Tracker

## Phase 1: Next.js, Shadcn, & Architecture Initialization (Strictly pnpm)

- [x] Initialize Next.js: `pnpm create next-app@latest hr-workflow-designer --typescript --tailwind --eslint --app --src-dir`
- [x] Initialize Shadcn UI: `pnpm dlx shadcn@latest init` (Choose "New York" style, CSS variables: yes).
- [x] Install Shadcn components: `pnpm dlx shadcn@latest add button sheet card input label select textarea scroll-area badge toast separator`
- [x] Install core dependencies: `pnpm add @xyflow/react zustand immer @tanstack/react-query react-hook-form @hookform/resolvers zod lucide-react clsx tailwind-merge`
- [x] Scaffold the feature-sliced folder structure:
  - [x] `src/app/api/` (Route handlers)
  - [x] `src/components/ui/` (Shadcn)
  - [x] `src/features/workflow-canvas/`
  - [x] `src/features/workflow-forms/`
  - [x] `src/features/workflow-sandbox/`
  - [x] `src/lib/` (Zod schemas, tailwind utils)
  - [x] `src/store/` (Zustand)
  - [x] `src/types/` (TypeScript definitions)

## Phase 2: Next.js Route Handlers & TanStack Query (Mock Backend)

- [x] Checkout branch: `git checkout -b mock-api-layer`
- [x] Define global types in `src/types/workflow.ts` (e.g., `NodeData`, `WorkflowState`, `ActionTemplate`).
- [x] Create `src/app/api/automations/route.ts`:
  - [x] Return JSON array of mock actions (e.g., `[{ id: 'email', label: 'Send Email', params: ['to', 'subject'] }]`).
- [x] Create `src/app/api/simulate/route.ts`:
  - [x] Parse incoming POST request (graph JSON).
  - [x] Add a simulated `await new Promise(r => setTimeout(r, 1500))` delay.
  - [x] Return a mock step-by-step execution timeline array.
- [x] Create `src/providers/QueryProvider.tsx` (Client component wrapping `<QueryClientProvider>`).
- [x] Wrap `src/app/layout.tsx` children with the `QueryProvider`.

## Phase 3: Global State Architecture (Zustand + Immer)

- [x] Checkout branch: `git checkout -b state-management`
- [x] Create `src/store/useWorkflowStore.ts`.
- [x] Initialize state: `nodes: []`, `edges: []`, `selectedNodeId: string | null`.
- [x] Implement standard React Flow actions: `onNodesChange`, `onEdgesChange`, `onConnect`.
- [x] Implement custom actions using Immer:
  - [x] `addNode(node)`
  - [x] `updateNodeData(id, data)` (Mutates `draft.nodes[index].data` cleanly).
  - [x] `setSelectedNode(id)`
  - [x] `deleteSelectedElements()`

## Phase 4: Canvas Engine & Custom Nodes (`@xyflow/react`)

- [x] Checkout branch: `git checkout -b canvas-engine`
- [x] Build the `Workspace` page in `src/app/page.tsx`.
- [x] Create `WorkflowCanvas` component (The `<ReactFlow>` wrapper).
- [x] Implement Custom Node UI Components (using Shadcn Cards/Badges):
  - [x] `StartNode.tsx` (Green accents, Right Target Handle).
  - [x] `TaskNode.tsx` (Blue accents, Left/Right Handles, Assignee/Date display).
  - [x] `ApprovalNode.tsx` (Orange accents, Left/Right Handles, Role display).
  - [x] `AutomatedNode.tsx` (Purple accents, Left/Right Handles, Lucide Icon).
  - [x] `EndNode.tsx` (Red/Gray accents, Left Source Handle).
- [x] Register all custom nodes in the `nodeTypes` object outside the component render cycle.
- [x] Build the `DraggableSidebar` component mapping out node templates.
- [x] Implement HTML5 Drag and Drop (`onDragStart`, `onDragOver`, `onDrop`) to spawn nodes at cursor coordinates.

## Phase 5: Dynamic Forms (React Hook Form + Zod)

- [x] Checkout branch: `git checkout -b node-forms`
- [x] Define Zod schemas in `src/lib/schemas.ts` for each node type's required metadata.
- [x] Build the `NodeConfigPanel` component using Shadcn `<Sheet>` or a fixed right-side panel.
- [x] Create individual form components inside `ConfigPanel`:
  - [x] `StartNodeForm` (Title, dynamic key-value inputs).
  - [x] `TaskNodeForm` (Title, Description textarea, Assignee input, Date picker).
  - [x] `ApprovalNodeForm` (Title, Role `<Select>`, Threshold numeric input).
  - [x] `AutomatedNodeForm` (Use TanStack Query `useQuery` to fetch `/api/automations` and populate a `<Select>`).
  - [x] `EndNodeForm` (Message textarea, Summary toggle `<Switch>`).
- [x] Wire forms to sync with Zustand: Use `useEffect` or `onChange` handlers to call `updateNodeData` so the canvas updates in real-time as the user types.

## Phase 6: Graph Validation & Execution Sandbox

- [x] Checkout branch: `git checkout -b execution-sandbox`
- [x] Write `src/lib/graphValidation.ts`:
  - [x] Ensure graph contains exactly one `StartNode`.
  - [x] Ensure graph contains at least one `EndNode`.
  - [x] Check for disconnected/orphaned nodes (Degree of 0).
  - [x] Detect cycles using Depth-First Search (DFS) or Kahn's Algorithm.
- [x] Build `SandboxModal` UI (Shadcn `<Dialog>`).
- [x] Implement "Test Workflow" interaction:
  - [x] On click, run validation. If fails, trigger Shadcn `<Toast>` with specific error.
  - [x] If valid, trigger TanStack Query `useMutation` to POST graph data to `/api/simulate`.
- [x] Build `ExecutionTimeline` component to visually render the simulated steps returned by the API.

## Phase 7: Polish, Export, & Documentation

- [x] Checkout branch: `git checkout -b final-polish`
- [x] Enable React Flow `<MiniMap>` and `<Background>`.
- [x] Add "Export JSON" button (Downloads Zustand `nodes` and `edges` state).
- [x] Add "Import JSON" button (File reader that hydrates Zustand state).
- [x] Ensure global Dark Mode / Light Mode toggle works via Next-Themes.
- [x] Write the `README.md`:
  - [x] Local setup steps.
  - [x] Architecture decisions (Next.js App Router, Zustand+Immer mutability, strict Zod validation).
  - [x] Features implemented (Cycle detection, dynamic API forms).
