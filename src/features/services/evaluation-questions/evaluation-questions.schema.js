import z from "zod";
export const evaluationQuestionSchema = z.object({
    id: z.number(),
    question_text: z.string(),
});
export const CreateEvaluationQuestionSchema = evaluationQuestionSchema.omit({ id: true });
export const UpdateEvaluationQuestionSchema = evaluationQuestionSchema.partial();
