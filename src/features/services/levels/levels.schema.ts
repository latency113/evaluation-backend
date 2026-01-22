import { z } from "zod";

export const levelSchema = z.object({
    id: z.number(),
    level_name: z.string(),
    dept_id: z.number().nullable().optional(),
    department: z.object({
        id: z.number(),
        dept_name: z.string(),
    }).nullable().optional(),
});

export const CreateLevelSchema = levelSchema.omit({ id: true });
export const UpdateLevelSchema = levelSchema.partial();

export type CreateLevelInput = z.infer<typeof CreateLevelSchema>;
export type UpdateLevelInput = z.infer<typeof UpdateLevelSchema>;
export type Level = z.infer<typeof levelSchema>;
