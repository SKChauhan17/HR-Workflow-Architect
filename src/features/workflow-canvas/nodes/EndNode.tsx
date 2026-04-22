'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleStop } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EndNodeData } from '@/types/workflow';

function EndNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as EndNodeData;

  return (
    <Card
      className={cn(
        'w-[200px] border border-[#e0e2e6] bg-white shadow-sm transition-shadow duration-200',
        selected && 'ring-2 ring-slate-500/50 shadow-md'
      )}
      size="sm"
    >
      {/* Target Handle — Left Side */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !rounded-full !border-2 !border-slate-500 !bg-white"
      />

      <CardHeader className="flex flex-row items-center gap-2 pb-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100">
          <CircleStop className="h-3.5 w-3.5 text-slate-600" />
        </div>
        <CardTitle className="text-sm font-medium text-[#181d26]">
          {nodeData.title || 'End'}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-1.5 pt-1">
        <Badge className="bg-slate-100 text-slate-600 border-slate-200/60 hover:bg-slate-100">
          End
        </Badge>
        {nodeData.endMessage && (
          <p className="text-xs text-muted-foreground leading-snug">
            {nodeData.endMessage}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export const EndNode = memo(EndNodeComponent);
