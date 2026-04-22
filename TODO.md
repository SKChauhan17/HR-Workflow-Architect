# HR Workflow Designer - Next.js Enterprise Implementation Tracker

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

- [ ] Checkout branch: `git checkout -b state-management`
- [ ] Create `src/store/useWorkflowStore.ts`.
- [ ] Initialize state: `nodes: []`, `edges: []`, `selectedNodeId: string | null`.
- [ ] Implement standard React Flow actions: `onNodesChange`, `onEdgesChange`, `onConnect`.
- [ ] Implement custom actions using Immer:
  - [ ] `addNode(node)`
  - [ ] `updateNodeData(id, data)` (Mutates `draft.nodes[index].data` cleanly).
  - [ ] `setSelectedNode(id)`
  - [ ] `deleteSelectedElements()`

## Phase 4: Canvas Engine & Custom Nodes (`@xyflow/react`)

- [ ] Checkout branch: `git checkout -b canvas-engine`
- [ ] Build the `Workspace` page in `src/app/page.tsx`.
- [ ] Create `WorkflowCanvas` component (The `<ReactFlow>` wrapper).
- [ ] Implement Custom Node UI Components (using Shadcn Cards/Badges):
  - [ ] `StartNode.tsx` (Green accents, Right Target Handle).
  - [ ] `TaskNode.tsx` (Blue accents, Left/Right Handles, Assignee/Date display).
  - [ ] `ApprovalNode.tsx` (Orange accents, Left/Right Handles, Role display).
  - [ ] `AutomatedNode.tsx` (Purple accents, Left/Right Handles, Lucide Icon).
  - [ ] `EndNode.tsx` (Red/Gray accents, Left Source Handle).
- [ ] Register all custom nodes in the `nodeTypes` object outside the component render cycle.
- [ ] Build the `DraggableSidebar` component mapping out node templates.
- [ ] Implement HTML5 Drag and Drop (`onDragStart`, `onDragOver`, `onDrop`) to spawn nodes at cursor coordinates.

## Phase 5: Dynamic Forms (React Hook Form + Zod)

- [ ] Checkout branch: `git checkout -b node-forms`
- [ ] Define Zod schemas in `src/lib/schemas.ts` for each node type's required metadata.
- [ ] Build the `NodeConfigPanel` component using Shadcn `<Sheet>` or a fixed right-side panel.
- [ ] Create individual form components inside `ConfigPanel`:
  - [ ] `StartNodeForm` (Title, dynamic key-value inputs).
  - [ ] `TaskNodeForm` (Title, Description textarea, Assignee input, Date picker).
  - [ ] `ApprovalNodeForm` (Title, Role `<Select>`, Threshold numeric input).
  - [ ] `AutomatedNodeForm` (Use TanStack Query `useQuery` to fetch `/api/automations` and populate a `<Select>`).
  - [ ] `EndNodeForm` (Message textarea, Summary toggle `<Switch>`).
- [ ] Wire forms to sync with Zustand: Use `useEffect` or `onChange` handlers to call `updateNodeData` so the canvas updates in real-time as the user types.

## Phase 6: Graph Validation & Execution Sandbox

- [ ] Checkout branch: `git checkout -b execution-sandbox`
- [ ] Write `src/lib/graphValidation.ts`:
  - [ ] Ensure graph contains exactly one `StartNode`.
  - [ ] Ensure graph contains at least one `EndNode`.
  - [ ] Check for disconnected/orphaned nodes (Degree of 0).
  - [ ] Detect cycles using Depth-First Search (DFS) or Kahn's Algorithm.
- [ ] Build `SandboxModal` UI (Shadcn `<Dialog>`).
- [ ] Implement "Test Workflow" interaction:
  - [ ] On click, run validation. If fails, trigger Shadcn `<Toast>` with specific error.
  - [ ] If valid, trigger TanStack Query `useMutation` to POST graph data to `/api/simulate`.
- [ ] Build `ExecutionTimeline` component to visually render the simulated steps returned by the API.

## Phase 7: Polish, Export, & Documentation

- [ ] Checkout branch: `git checkout -b final-polish`
- [ ] Enable React Flow `<MiniMap>` and `<Background>`.
- [ ] Add "Export JSON" button (Downloads Zustand `nodes` and `edges` state).
- [ ] Add "Import JSON" button (File reader that hydrates Zustand state).
- [ ] Ensure global Dark Mode / Light Mode toggle works via Next-Themes.
- [ ] Write the `README.md`:
  - [ ] Local setup steps.
  - [ ] Architecture decisions (Next.js App Router, Zustand+Immer mutability, strict Zod validation).
  - [ ] Features implemented (Cycle detection, dynamic API forms).
