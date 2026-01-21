import z from "zod";
export const levelSchema = z.object({
    id: z.number(),
    level_name: z.string(),
    dept_id: z.number().nullable().optional(),
});
export const CreateLevelSchema = levelSchema.omit({ id: true });
export const UpdateLevelSchema = levelSchema.partial();
