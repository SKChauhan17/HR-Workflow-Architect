'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StartNodeData } from '@/types/workflow';

function StartNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as StartNodeData;

  return (
    <Card
      className={cn(
        'w-[200px] border border-[#e0e2e6] bg-white shadow-sm transition-shadow duration-200',
        selected && 'ring-2 ring-emerald-500/50 shadow-md'
      )}
      size="sm"
    >
      <CardHeader className="flex flex-row items-center gap-2 pb-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50">
          <Play className="h-3.5 w-3.5 text-emerald-600" />
        </div>
        <CardTitle className="text-sm font-medium text-[#181d26]">
          {nodeData.title || 'Start'}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-1">
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100">
          Start
        </Badge>
      </CardContent>

      {/* Source Handle — Right Side */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !rounded-full !border-2 !border-emerald-500 !bg-white"
      />
    </Card>
  );
}

export const StartNode = memo(StartNodeComponent);
