import z from "zod";

export const evaluationAnswerSchema = z.object({
    id: z.number(),
    eval_id: z.number().nullable().optional(),
    question_id: z.number().nullable().optional(),
    score: z.number(),
});

export const CreateEvaluationAnswerSchema = evaluationAnswerSchema.omit({ id: true });
export const UpdateEvaluationAnswerSchema = evaluationAnswerSchema.partial();

export type CreateEvaluationAnswerInput = z.infer<typeof CreateEvaluationAnswerSchema>;
export type UpdateEvaluationAnswerInput = z.infer<typeof UpdateEvaluationAnswerSchema>;
export type EvaluationAnswer = z.infer<typeof evaluationAnswerSchema>;
