import { evaluationRepository } from "../../repositories/evaluations/evaluations.repository.js";
import { UpdateEvaluationInput, CreateEvaluationInput, evaluationSchema } from "./evaluations.schema.js";

export namespace EvaluationService {
    export const getAllEvaluations = async (page: number = 1, limit: number = 10) => {
        const [evaluations, total] = await Promise.all([
            evaluationRepository.getAllEvaluations(page, limit),
            evaluationRepository.countEvaluations()
        ]);

        return {
            evaluations: evaluations.map(evaluation => evaluationSchema.parse(evaluation)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    export const getAllEvaluationsWithoutPagination = async () => {
        const evaluations = await evaluationRepository.getAllEvaluationsWithoutPagination();
        return evaluations.map(evaluation => evaluationSchema.parse(evaluation));
    }

    export const getEvaluationById = async (id: number) => {
        const evaluation = await evaluationRepository.getEvaluationById(id);
        if (!evaluation) return null;
        return evaluationSchema.parse(evaluation);
    }

    export const createEvaluation = async (data: CreateEvaluationInput) => {
        const newEvaluation = await evaluationRepository.createEvaluation(data);
        return evaluationSchema.parse(newEvaluation);
    }

    export const updateEvaluation = async (id: number, data: UpdateEvaluationInput) => {
        const updatedEvaluation = await evaluationRepository.updateEvaluation(id, data);
        return evaluationSchema.parse(updatedEvaluation);
    }

    export const deleteEvaluation = async (id: number) => {
        const deletedEvaluation = await evaluationRepository.deleteEvaluation(id);
        return evaluationSchema.parse(deletedEvaluation);
    }
}
