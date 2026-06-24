import {
  ProjectStatus,
  ProjectVisibility,
  TaskPriority,
  TaskStatus,
} from "@/gql/schema-types"
import * as z from "zod"

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const createProjectSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(1000).optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  visibility: z.nativeEnum(ProjectVisibility).optional(),
  color: z.string().optional(),
  tags: z.string().optional(), // comma-separated
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
})

export type CreateProjectFormData = z.infer<typeof createProjectSchema>

export const createTaskSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().max(2000).optional(),

  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),

  labels: z.string().optional(), // comma-separated input

  dueDate: z.string().optional(),
})

export type CreateTaskFormData = z.infer<typeof createTaskSchema>

export type SignUpFormData = z.infer<typeof signUpSchema>
export type LoginFormData = z.infer<typeof loginSchema>
