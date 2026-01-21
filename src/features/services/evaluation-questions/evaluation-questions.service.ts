import { evaluationQuestionRepository } from "../../repositories/evaluation-questions/evaluation-questions.repository";
import { UpdateEvaluationQuestionInput, CreateEvaluationQuestionInput, evaluationQuestionSchema } from "./evaluation-questions.schema";

export namespace EvaluationQuestionService {
    export const getAllQuestions = async (page: number = 1, limit: number = 10) => {
        const [questions, total] = await Promise.all([
            evaluationQuestionRepository.getAllQuestions(page, limit),
            evaluationQuestionRepository.countQuestions()
        ]);

        return {
            questions: questions.map(question => evaluationQuestionSchema.parse(question)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    export const getQuestionById = async (id: number) => {
        const question = await evaluationQuestionRepository.getQuestionById(id);
        if (!question) return null;
        return evaluationQuestionSchema.parse(question);
    }

    export const createQuestion = async (data: CreateEvaluationQuestionInput) => {
        const newQuestion = await evaluationQuestionRepository.createQuestion(data);
        return evaluationQuestionSchema.parse(newQuestion);
    }

    export const updateQuestion = async (id: number, data: UpdateEvaluationQuestionInput) => {
        const updatedQuestion = await evaluationQuestionRepository.updateQuestion(id, data);
        return evaluationQuestionSchema.parse(updatedQuestion);
    }

    export const deleteQuestion = async (id: number) => {
        const deletedQuestion = await evaluationQuestionRepository.deleteQuestion(id);
        return evaluationQuestionSchema.parse(deletedQuestion);
    }
}
