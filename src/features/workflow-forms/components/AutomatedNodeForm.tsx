'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { automatedNodeSchema } from '@/lib/schemas';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ActionTemplate } from '@/types/workflow';

type AutomatedNodeFormValues = z.infer<typeof automatedNodeSchema>;

interface AutomatedNodeFormProps {
  nodeId: string;
  defaultValues?: Partial<AutomatedNodeFormValues>;
}

export function AutomatedNodeForm({ nodeId, defaultValues }: AutomatedNodeFormProps) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const { register, control, watch, formState: { errors } } = useForm<AutomatedNodeFormValues>({
    resolver: zodResolver(automatedNodeSchema),
    defaultValues: {
      title: defaultValues?.title || 'Automation',
      actionId: defaultValues?.actionId || '',
      params: defaultValues?.params || {},
    },
    mode: 'onChange',
  });

  const { data: actions = [], isLoading } = useQuery<ActionTemplate[]>({
    queryKey: ['automations'],
    queryFn: async () => {
      const res = await fetch('/api/automations');
      if (!res.ok) throw new Error('Failed to fetch automations');
      return res.json();
    },
  });

  const selectedActionId = watch('actionId');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch((value) => {
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      updateNodeData(nodeId, value as any);
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Node Title</Label>
        <Input id="title" {...register('title')} placeholder="Automation" />
        {errors.title && <p className="text-[11px] text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Action Type</Label>
        <Controller
          name="actionId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? 'Loading...' : 'Select action'} />
              </SelectTrigger>
              <SelectContent>
                {actions.map((action) => (
                  <SelectItem key={action.id} value={action.id}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.actionId && <p className="text-[11px] text-destructive">{errors.actionId.message}</p>}
      </div>

      {selectedActionId && actions.find(a => a.id === selectedActionId)?.params?.map((param) => (
        <div key={param} className="space-y-2 relative pl-2 border-l-2 border-slate-200">
          <Label className="text-xs text-muted-foreground capitalize">{param}</Label>
          <Input 
            className="h-8"
            {...register(`params.${param}` as const)} 
            placeholder={`Enter ${param}...`} 
          />
        </div>
      ))}
    </div>
  );
}
