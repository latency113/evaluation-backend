import z from "zod";

export const studentSchema = z.object({
    id: z.number(),
    student_code: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    classroom_id: z.number().nullable().optional(),
    classroom: z.object({
        id: z.number(),
        room_name: z.string(),
        level: z.object({
            id: z.number(),
            level_name: z.string(),
            department: z.object({
                id: z.number(),
                dept_name: z.string(),
            }).nullable().optional(),
        }).nullable().optional(),
    }).nullable().optional(),
});

export const CreateStudentSchema = studentSchema.omit({ id: true });
export const UpdateStudentSchema = studentSchema.partial();

export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentInput = z.infer<typeof UpdateStudentSchema>;
export type Student = z.infer<typeof studentSchema>;
