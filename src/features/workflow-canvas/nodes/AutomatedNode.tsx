'use client';

import { memo, type ElementType } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Mail, MessageSquare, Shield, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AutomatedNodeData } from '@/types/workflow';

/** Map of action IDs to their representative Lucide icon. */
const ACTION_ICONS: Record<string, ElementType> = {
  send_email: Mail,
  notify_slack: MessageSquare,
  trigger_bg_check: Shield,
  generate_offer_letter: FileText,
};

function AutomatedNodeComponent({ data, selected }: NodeProps<Node<AutomatedNodeData>>) {
  const ActionIcon = (data.actionId && ACTION_ICONS[data.actionId]) || Zap;

  return (
    <Card
      className={cn(
        'w-[240px] border border-[#e0e2e6] bg-white shadow-sm transition-shadow duration-200',
        selected && 'ring-2 ring-purple-500/50 shadow-md'
      )}
      size="sm"
    >
      {/* Target Handle — Left Side */}
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !rounded-full !border-2 !border-purple-500 !bg-white"
      />

      <CardHeader className="flex flex-row items-center gap-2 pb-0">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-purple-50">
          <ActionIcon className="h-3.5 w-3.5 text-purple-600" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <CardTitle className="text-sm font-medium text-[#181d26] truncate">
            {data.title || 'Automation'}
          </CardTitle>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200/60 hover:bg-purple-100 w-fit shrink-0">
            Automated
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground w-full">
          <Zap className="h-3 w-3 shrink-0" />
          <span className="truncate min-w-0">{data.actionId || 'No action set'}</span>
        </div>
      </CardContent>

      {/* Source Handle — Right Side */}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !rounded-full !border-2 !border-purple-500 !bg-white"
      />
    </Card>
  );
}

export const AutomatedNode = memo(AutomatedNodeComponent);
