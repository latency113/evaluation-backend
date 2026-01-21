import z from "zod";
export const departmentSchema = z.object({
    id: z.number(),
    dept_name: z.string(),
});
export const CreateDepartmentSchema = departmentSchema.omit({ id: true });
export const UpdateDepartmentSchema = departmentSchema.partial();
