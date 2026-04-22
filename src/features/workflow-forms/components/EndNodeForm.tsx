'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { endNodeSchema } from '@/lib/schemas';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { EndNodeData } from '@/types/workflow';

type EndNodeFormValues = z.infer<typeof endNodeSchema>;

interface EndNodeFormProps {
  nodeId: string;
  defaultValues?: Partial<EndNodeFormValues>;
}

export function EndNodeForm({ nodeId, defaultValues }: EndNodeFormProps) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const { register, control, watch, formState: { errors } } = useForm<EndNodeFormValues>({
    resolver: zodResolver(endNodeSchema),
    defaultValues: {
      title: defaultValues?.title || 'End',
      endMessage: defaultValues?.endMessage || '',
      summary: defaultValues?.summary || false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch((value) => {
      updateNodeData(nodeId, value as Partial<EndNodeData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Node Title</Label>
        <Input id="title" {...register('title')} placeholder="End" />
        {errors.title && <p className="text-[11px] text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="endMessage">Completion Message</Label>
        <Textarea id="endMessage" {...register('endMessage')} placeholder="Workflow completed..." />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <Label>Email Summary</Label>
          <p className="text-[11px] text-muted-foreground">
            Send timeline abstract on finish
          </p>
        </div>
        <Controller
          name="summary"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
}
