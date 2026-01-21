import { z } from "zod";

export const teacherSchema = z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
});

export const CreateTeacherSchema = teacherSchema.omit({ id: true });
export const UpdateTeacherSchema = teacherSchema.partial();

export type CreateTeacherInput = z.infer<typeof CreateTeacherSchema>;
export type UpdateTeacherInput = z.infer<typeof UpdateTeacherSchema>;
export type Teacher = z.infer<typeof teacherSchema>;
