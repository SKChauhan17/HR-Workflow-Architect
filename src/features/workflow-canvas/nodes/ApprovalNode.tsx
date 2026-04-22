'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ApprovalNodeData } from '@/types/workflow';

function ApprovalNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as ApprovalNodeData;

  return (
    <Card
      className={cn(
        'w-[240px] border border-[#e0e2e6] bg-white shadow-sm transition-shadow duration-200',
        selected && 'ring-2 ring-amber-500/50 shadow-md'
      )}
      size="sm"
    >
      {/* Target Handle — Left Side */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !rounded-full !border-2 !border-amber-500 !bg-white"
      />

      <CardHeader className="flex flex-row items-center gap-2 pb-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-50">
          <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <CardTitle className="text-sm font-medium text-[#181d26] truncate">
            {nodeData.title || 'Approval'}
          </CardTitle>
          <Badge className="bg-amber-100 text-amber-700 border-amber-200/60 hover:bg-amber-100 w-fit shrink-0">
            Approval
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-1.5 pt-1">
        {nodeData.role && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground w-full">
            <UserCheck className="h-3 w-3 shrink-0" />
            <span className="truncate min-w-0">{nodeData.role}</span>
          </div>
        )}
      </CardContent>

      {/* Source Handle — Right Side */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !rounded-full !border-2 !border-amber-500 !bg-white"
      />
    </Card>
  );
}

export const ApprovalNode = memo(ApprovalNodeComponent);
