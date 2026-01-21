import { evaluationRepository } from "../../repositories/evaluations/evaluations.repository";
import { evaluationSchema } from "./evaluations.schema";
export var EvaluationService;
(function (EvaluationService) {
    EvaluationService.getAllEvaluations = async (page = 1, limit = 10) => {
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
    };
    EvaluationService.getEvaluationById = async (id) => {
        const evaluation = await evaluationRepository.getEvaluationById(id);
        if (!evaluation)
            return null;
        return evaluationSchema.parse(evaluation);
    };
    EvaluationService.createEvaluation = async (data) => {
        const newEvaluation = await evaluationRepository.createEvaluation(data);
        return evaluationSchema.parse(newEvaluation);
    };
    EvaluationService.updateEvaluation = async (id, data) => {
        const updatedEvaluation = await evaluationRepository.updateEvaluation(id, data);
        return evaluationSchema.parse(updatedEvaluation);
    };
    EvaluationService.deleteEvaluation = async (id) => {
        const deletedEvaluation = await evaluationRepository.deleteEvaluation(id);
        return evaluationSchema.parse(deletedEvaluation);
    };
})(EvaluationService || (EvaluationService = {}));
