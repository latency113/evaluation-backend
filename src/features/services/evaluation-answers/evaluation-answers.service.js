import { evaluationAnswerRepository } from "../../repositories/evaluation-answers/evaluation-answers.repository";
import { evaluationAnswerSchema } from "./evaluation-answers.schema";
export var EvaluationAnswerService;
(function (EvaluationAnswerService) {
    EvaluationAnswerService.getAllAnswers = async (page = 1, limit = 10) => {
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
    };
    EvaluationAnswerService.getAnswerById = async (id) => {
        const answer = await evaluationAnswerRepository.getAnswerById(id);
        if (!answer)
            return null;
        return evaluationAnswerSchema.parse(answer);
    };
    EvaluationAnswerService.createAnswer = async (data) => {
        const newAnswer = await evaluationAnswerRepository.createAnswer(data);
        return evaluationAnswerSchema.parse(newAnswer);
    };
    EvaluationAnswerService.updateAnswer = async (id, data) => {
        const updatedAnswer = await evaluationAnswerRepository.updateAnswer(id, data);
        return evaluationAnswerSchema.parse(updatedAnswer);
    };
    EvaluationAnswerService.deleteAnswer = async (id) => {
        const deletedAnswer = await evaluationAnswerRepository.deleteAnswer(id);
        return evaluationAnswerSchema.parse(deletedAnswer);
    };
})(EvaluationAnswerService || (EvaluationAnswerService = {}));
