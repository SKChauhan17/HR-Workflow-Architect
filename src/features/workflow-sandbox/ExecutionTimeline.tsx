'use client';

import { CheckCircle2, XCircle, Clock, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SimulationStep } from '@/types/workflow';

/** Visual config per step status. */
const STATUS_CONFIG: Record<
  SimulationStep['status'],
  { icon: LucideIcon; dotColor: string; iconColor: string; label: string }
> = {
  success: {
    icon: CheckCircle2,
    dotColor: 'bg-emerald-500',
    iconColor: 'text-emerald-600',
    label: 'Completed',
  },
  failed: {
    icon: XCircle,
    dotColor: 'bg-red-500',
    iconColor: 'text-red-600',
    label: 'Failed',
  },
  pending: {
    icon: Clock,
    dotColor: 'bg-amber-400',
    iconColor: 'text-amber-500',
    label: 'Pending',
  },
};

interface ExecutionTimelineProps {
  steps: SimulationStep[];
}

export function ExecutionTimeline({ steps }: ExecutionTimelineProps) {
  if (steps.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-slate-400">
        No execution steps to display.
      </p>
    );
  }

  return (
    <div className="relative flex flex-col gap-0 py-2">
      {steps.map((step, index) => {
        const config = STATUS_CONFIG[step.status];
        const Icon = config.icon;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.stepId} className="relative flex gap-4 pb-6 last:pb-0">
            {/* ── Vertical line + dot ──────────────────── */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white bg-white shadow-sm',
                )}
              >
                <Icon className={cn('h-4 w-4', config.iconColor)} />
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-border" />
              )}
            </div>

            {/* ── Step content card ────────────────────── */}
            <div className="flex flex-1 flex-col gap-1 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-slate-900">
                  Step {index + 1}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                    step.status === 'success' && 'bg-emerald-50 text-emerald-700',
                    step.status === 'failed' && 'bg-red-50 text-red-700',
                    step.status === 'pending' && 'bg-amber-50 text-amber-700'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-1.5 w-1.5 rounded-full',
                      config.dotColor
                    )}
                  />
                  {config.label}
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {step.message}
              </p>

              <time className="text-[11px] text-slate-400">
                {new Date(step.timestamp).toLocaleTimeString()}
              </time>
            </div>
          </div>
        );
      })}
    </div>
  );
}
