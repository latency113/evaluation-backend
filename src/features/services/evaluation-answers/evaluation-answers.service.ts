import { evaluationAnswerRepository } from "../../repositories/evaluation-answers/evaluation-answers.repository";
import { UpdateEvaluationAnswerInput, CreateEvaluationAnswerInput, evaluationAnswerSchema } from "./evaluation-answers.schema";

export namespace EvaluationAnswerService {
    export const getAllAnswers = async (page: number = 1, limit: number = 10) => {
        const [answers, total] = await Promise.all([
            evaluationAnswerRepository.getAllAnswers(page, limit),
            evaluationAnswerRepository.countAnswers()
        ]);

        return {
            answers: answers.map(answer => evaluationAnswerSchema.parse(answer)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    export const getAnswerById = async (id: number) => {
        const answer = await evaluationAnswerRepository.getAnswerById(id);
        if (!answer) return null;
        return evaluationAnswerSchema.parse(answer);
    }

    export const createAnswer = async (data: CreateEvaluationAnswerInput) => {
        const newAnswer = await evaluationAnswerRepository.createAnswer(data);
        return evaluationAnswerSchema.parse(newAnswer);
    }

    export const updateAnswer = async (id: number, data: UpdateEvaluationAnswerInput) => {
        const updatedAnswer = await evaluationAnswerRepository.updateAnswer(id, data);
        return evaluationAnswerSchema.parse(updatedAnswer);
    }

    export const deleteAnswer = async (id: number) => {
        const deletedAnswer = await evaluationAnswerRepository.deleteAnswer(id);
        return evaluationAnswerSchema.parse(deletedAnswer);
    }
}
