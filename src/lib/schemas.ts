import { z } from 'zod';

export const startNodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  metadata: z.array(
    z.object({
      key: z.string().min(1, 'Key is required'),
      value: z.string().min(1, 'Value is required'),
    })
  ).optional(),
});

export const taskNodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  customFields: z.array(
    z.object({
      key: z.string().min(1, 'Key is required'),
      value: z.string().min(1, 'Value is required'),
    })
  ).optional(),
});

export const approvalNodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  role: z.enum(['Manager', 'HRBP', 'Director']).optional(),
  threshold: z.coerce.number().min(1).optional(),
});

export const automatedNodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  actionId: z.string().min(1, 'Action ID is required'),
  params: z.record(z.string(), z.string()).optional(),
});

export const endNodeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  endMessage: z.string().optional(),
  summary: z.boolean().optional(),
});
