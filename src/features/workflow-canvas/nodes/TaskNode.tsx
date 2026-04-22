'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, User, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TaskNodeData } from '@/types/workflow';

function TaskNodeComponent({ data, selected }: NodeProps<TaskNodeData>) {
  return (
    <Card
      className={cn(
        'w-[240px] border border-[#e0e2e6] bg-white shadow-sm transition-shadow duration-200',
        selected && 'ring-2 ring-blue-500/50 shadow-md'
      )}
      size="sm"
    >
      {/* Target Handle — Left Side */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !rounded-full !border-2 !border-blue-500 !bg-white"
      />

      <CardHeader className="flex flex-row items-center gap-2 pb-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50">
          <ClipboardList className="h-3.5 w-3.5 text-blue-600" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <CardTitle className="text-sm font-medium text-[#181d26] truncate">
            {data.title || 'Task'}
          </CardTitle>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200/60 hover:bg-blue-100 w-fit shrink-0">
            Task
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-1.5 pt-1">
        {data.assignee && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground w-full">
            <User className="h-3 w-3 shrink-0" />
            <span className="truncate min-w-0">{data.assignee}</span>
          </div>
        )}
        {data.dueDate && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground w-full">
            <CalendarDays className="h-3 w-3 shrink-0" />
            <span className="truncate min-w-0">{data.dueDate}</span>
          </div>
        )}
      </CardContent>

      {/* Source Handle — Right Side */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !rounded-full !border-2 !border-blue-500 !bg-white"
      />
    </Card>
  );
}

export const TaskNode = memo(TaskNodeComponent);
