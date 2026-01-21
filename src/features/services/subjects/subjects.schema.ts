import z from "zod";

export const subjectSchema = z.object({
    id: z.number(),
    subject_code: z.string(),
    subject_name: z.string(),
});

export const CreateSubjectSchema = subjectSchema.omit({ id: true });
export const UpdateSubjectSchema = subjectSchema.partial();

export type CreateSubjectInput = z.infer<typeof CreateSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof UpdateSubjectSchema>;
export type Subject = z.infer<typeof subjectSchema>;
