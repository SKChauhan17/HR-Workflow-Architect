'use client';

import { type DragEvent } from 'react';
import {
  Play,
  ClipboardList,
  ShieldCheck,
  Zap,
  CircleStop,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/** Template definition for a draggable node type. */
interface NodeTemplate {
  type: string;
  label: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

const NODE_TEMPLATES: NodeTemplate[] = [
  {
    type: 'start',
    label: 'Start',
    description: 'Workflow entry point',
    icon: Play,
    iconBgColor: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    type: 'task',
    label: 'Task',
    description: 'Assign work to a user',
    icon: ClipboardList,
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    type: 'approval',
    label: 'Approval',
    description: 'Require sign-off',
    icon: ShieldCheck,
    iconBgColor: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    type: 'automated',
    label: 'Automated',
    description: 'Trigger an action',
    icon: Zap,
    iconBgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    type: 'end',
    label: 'End',
    description: 'Workflow termination',
    icon: CircleStop,
    iconBgColor: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
];

function onDragStart(event: DragEvent<HTMLDivElement>, nodeType: string) {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
}

export function DraggableSidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-white">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1b61c9] shadow-sm">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            Node Palette
          </h2>
          <p className="text-[11px] text-slate-500 leading-tight">
            Drag to canvas
          </p>
        </div>
      </div>

      {/* Node Templates */}
      <div className="flex flex-col gap-1.5 p-3">
        <p className="px-1 pb-1 text-[11px] font-medium text-slate-400">
          Components
        </p>

        {NODE_TEMPLATES.map((template) => {
          const Icon = template.icon;

          return (
            <div
              key={template.type}
              draggable
              onDragStart={(e) => onDragStart(e, template.type)}
              className={cn(
                'flex cursor-grab items-center gap-3 rounded-xl border border-border bg-white px-3 py-2.5',
                'shadow-sm transition-all duration-200',
                'hover:border-primary/40 hover:shadow-md',
                'active:cursor-grabbing active:scale-[0.98]'
              )}
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                  template.iconBgColor
                )}
              >
                <Icon className={cn('h-4 w-4', template.iconColor)} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-slate-900">
                  {template.label}
                </span>
                <span className="text-[11px] text-slate-400 leading-tight">
                  {template.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
