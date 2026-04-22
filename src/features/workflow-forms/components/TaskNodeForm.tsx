'use client';

import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { taskNodeSchema } from '@/lib/schemas';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type TaskNodeFormValues = z.infer<typeof taskNodeSchema>;

interface TaskNodeFormProps {
  nodeId: string;
  defaultValues?: Partial<TaskNodeFormValues>;
}

export function TaskNodeForm({ nodeId, defaultValues }: TaskNodeFormProps) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const { register, control, watch, formState: { errors } } = useForm<TaskNodeFormValues>({
    resolver: zodResolver(taskNodeSchema),
    defaultValues: {
      title: defaultValues?.title || 'New Task',
      description: defaultValues?.description || '',
      assignee: defaultValues?.assignee || '',
      dueDate: defaultValues?.dueDate || '',
      customFields: defaultValues?.customFields || [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    name: 'customFields',
    control,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch((value) => {
      // @ts-expect-error Form values match NodeData structure loosely
      updateNodeData(nodeId, value);
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input id="title" {...register('title')} placeholder="New Task" />
        {errors.title && <p className="text-[11px] text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} placeholder="Details..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Assignee</Label>
        <Input id="assignee" {...register('assignee')} placeholder="john.doe@example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input id="dueDate" type="date" {...register('dueDate')} />
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Custom Fields</Label>
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
              {...register(`customFields.${index}.key` as const)}
            />
            <Input
              placeholder="Value"
              className="h-8"
              {...register(`customFields.${index}.value` as const)}
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
