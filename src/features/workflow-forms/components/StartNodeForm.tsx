'use client';

import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { startNodeSchema } from '@/lib/schemas';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { StartNodeData } from '@/types/workflow';

type StartNodeFormValues = z.infer<typeof startNodeSchema>;

interface StartNodeFormProps {
  nodeId: string;
  defaultValues?: Partial<StartNodeFormValues>;
}

export function StartNodeForm({ nodeId, defaultValues }: StartNodeFormProps) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const { register, control, watch, formState: { errors } } = useForm<StartNodeFormValues>({
    resolver: zodResolver(startNodeSchema),
    defaultValues: {
      title: defaultValues?.title || 'Start',
      metadata: defaultValues?.metadata || [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'metadata',
    control,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch((value) => {
      updateNodeData(nodeId, value as Partial<StartNodeData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Node Title</Label>
        <Input id="title" {...register('title')} placeholder="Start" />
        {errors.title && <p className="text-[11px] text-destructive">{errors.title.message}</p>}
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Metadata Variables</Label>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => append({ key: '', value: '' })}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              placeholder="Key"
              className="h-8"
              {...register(`metadata.${index}.key` as const)}
            />
            <Input
              placeholder="Value"
              className="h-8"
              {...register(`metadata.${index}.value` as const)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
