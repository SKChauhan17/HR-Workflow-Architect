'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { approvalNodeSchema } from '@/lib/schemas';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ApprovalNodeFormValues = z.infer<typeof approvalNodeSchema>;

interface ApprovalNodeFormProps {
  nodeId: string;
  defaultValues?: Partial<ApprovalNodeFormValues>;
}

export function ApprovalNodeForm({ nodeId, defaultValues }: ApprovalNodeFormProps) {
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const { register, control, watch, formState: { errors } } = useForm<ApprovalNodeFormValues>({
    resolver: zodResolver(approvalNodeSchema),
    defaultValues: {
      title: defaultValues?.title || 'Approval Gate',
      // @ts-expect-error fallback role
      role: defaultValues?.role || '',
      threshold: defaultValues?.threshold || 1,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch((value) => {
      // @ts-expect-error Form values match NodeData loosely
      updateNodeData(nodeId, value);
    });
    return () => subscription.unsubscribe();
  }, [watch, nodeId, updateNodeData]);

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="title">Gate Title</Label>
        <Input id="title" {...register('title')} placeholder="Approval Gate" />
        {errors.title && <p className="text-[11px] text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Approver Role</Label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="HRBP">HRBP</SelectItem>
                <SelectItem value="Director">Director</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="threshold">Required Approvals</Label>
        <Input id="threshold" type="number" min={1} {...register('threshold')} />
      </div>
    </div>
  );
}
