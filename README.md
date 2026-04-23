<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" role="img" aria-labelledby="title desc" style="width:100%;height:auto;display:block;border-radius:28px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.28);margin:0 auto 24px;">
  <title id="title">HR Workflow Designer</title>
  <desc id="desc">Minimalist dark-mode banner for the HR Workflow Designer open-source project.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1220" />
      <stop offset="55%" stop-color="#111827" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="blueGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1b61c9" />
      <stop offset="100%" stop-color="#60a5fa" />
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.11  0 1 0 0 0.38  0 0 1 0 0.79  0 0 0 0.35 0" />
    </filter>
  </defs>
  <rect width="1200" height="300" fill="url(#bg)" />
  <circle cx="1000" cy="60" r="84" fill="#1d4ed8" opacity="0.14" filter="url(#softGlow)" />
  <circle cx="1080" cy="214" r="58" fill="#2563eb" opacity="0.18" filter="url(#softGlow)" />
  <path d="M90 210c84-58 168-58 252 0s168 58 252 0 168-58 252 0 168 58 252 0" fill="none" stroke="url(#blueGlow)" stroke-width="8" stroke-linecap="round" opacity="0.38" />
  <g transform="translate(86 72)">
    <rect x="0" y="0" width="126" height="126" rx="30" fill="#0f172a" stroke="#1e3a8a" stroke-width="2" />
    <circle cx="90" cy="26" r="9" fill="#60a5fa" />
    <circle cx="32" cy="64" r="9" fill="#93c5fd" />
    <circle cx="90" cy="100" r="9" fill="#60a5fa" />
    <path d="M40 56l38-20" stroke="#dbeafe" stroke-width="7" stroke-linecap="round" />
    <path d="M40 72l38 20" stroke="#dbeafe" stroke-width="7" stroke-linecap="round" />
  </g>
  <text x="240" y="122" fill="#f8fafc" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="54" font-weight="700" letter-spacing="-0.04em">HR Workflow Designer</text>
  <text x="240" y="168" fill="#cbd5e1" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="22" font-weight="500" letter-spacing="0.01em">Enterprise workflow orchestration for HR teams with validation, simulation, and time-travel editing.</text>
  <g transform="translate(240 200)">
    <rect x="0" y="0" width="186" height="42" rx="21" fill="#1b61c9" />
    <text x="93" y="27" text-anchor="middle" fill="#ffffff" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="17" font-weight="600">Open-source workflow canvas</text>
  </g>
</svg>

<h1>HR Workflow Designer</h1>
<p><strong>Enterprise-grade HR workflow orchestration with React Flow, Zustand, React Hook Form, and Zod.</strong></p>

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React%20Flow-FF5A00?style=for-the-badge&logo=react&logoColor=white" alt="React Flow" />
  <img src="https://img.shields.io/badge/Zustand-2C6BFF?style=for-the-badge&logo=zustand&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

</div>

## Overview

HR Workflow Designer is a visual, enterprise-style workflow builder for HR operations. It lets teams assemble approval pipelines, task chains, and automation steps on a canvas, configure each node with type-safe forms, validate graph integrity, and run a simulation before release.

| Dimension | Details |
| --- | --- |
| App model | Next.js App Router |
| Canvas engine | React Flow |
| State management | Zustand + Immer |
| Forms and validation | React Hook Form + Zod |
| Execution flow | Validation gate + simulation API |
| Theme system | `next-themes` with semantic tokens |

## Architecture

```text
+-----------------------------+      +------------------------------+
| React Flow Canvas           | ---> | Zustand Workflow Store       |
| nodes, edges, MiniMap, UX   |      | nodes, edges, history, sync  |
+-----------------------------+      +------------------------------+
               |                                   |
               v                                   v
+-----------------------------+      +------------------------------+
| Dynamic Node Forms          | ---> | Validation Engine (DFS)      |
| Zod + RHF                   |      | + Simulation / Sandbox       |
+-----------------------------+      +------------------------------+
```

### Architectural Notes

| Layer | Role | Why it exists |
| --- | --- | --- |
| App Router | Separates page, layout, and route handlers | Keeps server and client boundaries explicit |
| Zustand + Immer | Centralizes mutable graph state | Makes structural canvas edits simple and predictable |
| React Flow | Renders graph interactions | Provides the diagram primitives, edge model, and canvas controls |
| Zod | Validates node payloads and simulation input | Prevents invalid graph data from spreading through the UI |

## Core Features

| Feature | Description |
| --- | --- |
| DFS cycle detection | Rejects workflows with loops before simulation |
| Undo / Redo | Time-travel history for structural graph changes |
| JSON import / export | Shareable workflow snapshots |
| Custom deletable edges | Inline edge-level deletion controls |
| Dynamic node forms | Typed config panels for each node type |
| Theme-aware canvas | Dark and light modes with semantic tokens |
| MiniMap navigation | Pannable and zoomable overview of the graph |
| Execution sandbox | Validates and simulates workflows step by step |

## Setup Instructions

```bash
pnpm install
pnpm dev
```

Open the application at:

```text
http://localhost:3000
```

### Optional Commands

| Command | Purpose |
| --- | --- |
| `pnpm lint` | Run ESLint across the codebase |
| `pnpm build` | Produce a production build |
| `pnpm start` | Serve the built app |

## Working Principle

The system is designed around a simple flow:

1. Drag nodes from the palette into the canvas.
2. Configure node metadata in the right-hand panel.
3. Validate the graph and detect cycles.
4. Simulate the workflow execution.
5. Export or import the graph when needed.

This keeps the editing experience fast, legible, and safe for enterprise use.
