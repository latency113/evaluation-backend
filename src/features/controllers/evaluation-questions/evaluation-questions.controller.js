import { CreateEvaluationQuestionSchema, UpdateEvaluationQuestionSchema } from "@/features/services/evaluation-questions/evaluation-questions.schema";
import { EvaluationQuestionService } from "@/features/services/evaluation-questions/evaluation-questions.service";
import { ZodError } from "zod";
export var EvaluationQuestionController;
(function (EvaluationQuestionController) {
    EvaluationQuestionController.getAllQuestionsHandler = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await EvaluationQuestionService.getAllQuestions(page, limit);
            res
                .status(200)
                .json({
                message: "Evaluation questions retrieved successfully",
                data: result.questions,
                meta: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages
                }
            });
        }
        catch (error) {
            console.error("Error retrieving evaluation questions:", error);
            res.status(500).json({
                message: "Error retrieving evaluation questions",
                error: error instanceof Error ? { message: error.message } : error
            });
        }
    };
    EvaluationQuestionController.getQuestionByIdHandler = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid question ID" });
            }
            const question = await EvaluationQuestionService.getQuestionById(id);
            if (!question) {
                return res.status(404).json({ message: "Evaluation question not found" });
            }
            res.status(200).json({ message: "Evaluation question retrieved successfully", data: question });
        }
        catch (error) {
            console.error("Error retrieving evaluation question:", error);
            res.status(500).json({
                message: "Error retrieving evaluation question",
                error: error instanceof Error ? { message: error.message } : error
            });
        }
    };
    EvaluationQuestionController.createQuestionHandler = async (req, res) => {
        try {
            const parsedData = CreateEvaluationQuestionSchema.parse(req.body);
            const question = await EvaluationQuestionService.createQuestion(parsedData);
            res
                .status(201)
                .json({ message: "Evaluation question created successfully", data: question });
        }
        catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ message: "Validation error", errors: error });
            }
            console.error("Error creating evaluation question:", error);
            res.status(500).json({
                message: "Error creating evaluation question",
                error: error instanceof Error ? { message: error.message } : error
            });
        }
    };
    EvaluationQuestionController.updateQuestionHandler = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid question ID" });
            }
            const parsedData = UpdateEvaluationQuestionSchema.parse(req.body);
            const question = await EvaluationQuestionService.updateQuestion(id, parsedData);
            res
                .status(200)
                .json({ message: "Evaluation question updated successfully", data: question });
        }
        catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ message: "Validation error", errors: error });
            }
            console.error("Error updating evaluation question:", error);
            res.status(500).json({
                message: "Error updating evaluation question",
                error: error instanceof Error ? { message: error.message } : error
            });
        }
    };
    EvaluationQuestionController.deleteQuestionHandler = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid question ID" });
            }
            const question = await EvaluationQuestionService.deleteQuestion(id);
            res
                .status(200)
                .json({ message: "Evaluation question deleted successfully", data: question });
        }
        catch (error) {
            console.error("Error deleting evaluation question:", error);
            res.status(500).json({
                message: "Error deleting evaluation question",
                error: error instanceof Error ? { message: error.message } : error
            });
        }
    };
})(EvaluationQuestionController || (EvaluationQuestionController = {}));
