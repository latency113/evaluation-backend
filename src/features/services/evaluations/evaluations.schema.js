import z from "zod";
export const evaluationSchema = z.object({
    id: z.number(),
    assignment_id: z.number().nullable().optional(),
    student_id: z.number().nullable().optional(),
    suggestion: z.string().nullable().optional(),
    eval_date: z.date(),
    student: z.object({
        id: z.number(),
        student_code: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        classroom: z.object({
            id: z.number(),
            room_name: z.string(),
        }).nullable().optional(),
    }).nullable().optional(),
    assignment: z.object({
        id: z.number(),
        subject: z.object({
            subject_name: z.string(),
            subject_code: z.string(),
        }).nullable().optional(),
        teacher: z.object({
            first_name: z.string(),
            last_name: z.string(),
        }).nullable().optional(),
        classroom: z.object({
            id: z.number(),
            room_name: z.string(),
            level: z.object({
                level_name: z.string(),
                department: z.object({
                    dept_name: z.string()
                }).nullable().optional(),
            }).nullable().optional(),
        }).nullable().optional(),
    }).nullable().optional(),
    answers: z.array(z.object({
        id: z.number(),
        score: z.number(),
        question_id: z.number().nullable().optional(),
        question: z.object({
            question_text: z.string()
        }).nullable().optional(),
    })).nullable().optional(),
});
export const CreateEvaluationSchema = evaluationSchema.omit({
    id: true,
    eval_date: true,
    student: true,
    assignment: true,
    answers: true
});
export const UpdateEvaluationSchema = CreateEvaluationSchema.partial();
