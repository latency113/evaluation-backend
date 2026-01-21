import z from "zod";

export const evaluationQuestionSchema = z.object({
    id: z.number(),
    question_text: z.string(),
});

export const CreateEvaluationQuestionSchema = evaluationQuestionSchema.omit({ id: true });
export const UpdateEvaluationQuestionSchema = evaluationQuestionSchema.partial();

export type CreateEvaluationQuestionInput = z.infer<typeof CreateEvaluationQuestionSchema>;
export type UpdateEvaluationQuestionInput = z.infer<typeof UpdateEvaluationQuestionSchema>;
export type EvaluationQuestion = z.infer<typeof evaluationQuestionSchema>;
