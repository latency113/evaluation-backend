import { evaluationQuestionRepository } from "../../repositories/evaluation-questions/evaluation-questions.repository";
import { evaluationQuestionSchema } from "./evaluation-questions.schema";
export var EvaluationQuestionService;
(function (EvaluationQuestionService) {
    EvaluationQuestionService.getAllQuestions = async (page = 1, limit = 10) => {
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
    };
    EvaluationQuestionService.getQuestionById = async (id) => {
        const question = await evaluationQuestionRepository.getQuestionById(id);
        if (!question)
            return null;
        return evaluationQuestionSchema.parse(question);
    };
    EvaluationQuestionService.createQuestion = async (data) => {
        const newQuestion = await evaluationQuestionRepository.createQuestion(data);
        return evaluationQuestionSchema.parse(newQuestion);
    };
    EvaluationQuestionService.updateQuestion = async (id, data) => {
        const updatedQuestion = await evaluationQuestionRepository.updateQuestion(id, data);
        return evaluationQuestionSchema.parse(updatedQuestion);
    };
    EvaluationQuestionService.deleteQuestion = async (id) => {
        const deletedQuestion = await evaluationQuestionRepository.deleteQuestion(id);
        return evaluationQuestionSchema.parse(deletedQuestion);
    };
})(EvaluationQuestionService || (EvaluationQuestionService = {}));
