import { z } from "zod";

export const departmentSchema = z.object({
    id: z.number(),
    dept_name: z.string(),
});

export const CreateDepartmentSchema = departmentSchema.omit({ id: true });
export const UpdateDepartmentSchema = departmentSchema.partial();

export type CreateDepartmentInput = z.infer<typeof CreateDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof UpdateDepartmentSchema>;
export type Department = z.infer<typeof departmentSchema>;
