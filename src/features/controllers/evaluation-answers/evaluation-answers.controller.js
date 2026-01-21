import { CreateEvaluationAnswerSchema, UpdateEvaluationAnswerSchema } from "@/features/services/evaluation-answers/evaluation-answers.schema";
import { EvaluationAnswerService } from "@/features/services/evaluation-answers/evaluation-answers.service";
import { ZodError } from "zod";
export var EvaluationAnswerController;
(function (EvaluationAnswerController) {
    EvaluationAnswerController.getAllAnswersHandler = async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await EvaluationAnswerService.getAllAnswers(page, limit);
            res
                .status(200)
                .json({
                message: "Evaluation answers retrieved successfully",
                data: result.answers,
                meta: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages
                }
            });
        }
        catch (error) {
            console.error("Error retrieving evaluation answers:", error);
            res.status(500).json({
                message: "Error retrieving evaluation answers",
                error: error instanceof Error ? { message: error.message } : error
            });
        }
    };
    EvaluationAnswerController.getAnswerByIdHandler = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid answer ID" });
            }
            const answer = await EvaluationAnswerService.getAnswerById(id);
            if (!answer) {
                return res.status(404).json({ message: "Evaluation answer not found" });
            }
            res.status(200).json({ message: "Evaluation answer retrieved successfully", data: answer });
        }
        catch (error) {
            console.error("Error retrieving evaluation answer:", error);
            res.status(500).json({
                message: "Error retrieving evaluation answer",
                error: error instanceof Error ? { message: error.message } : error
            });
        }
    };
    EvaluationAnswerController.createAnswerHandler = async (req, res) => {
        try {
            const parsedData = CreateEvaluationAnswerSchema.parse(req.body);
            const answer = await EvaluationAnswerService.createAnswer(parsedData);
            res
                .status(201)
                .json({ message: "Evaluation answer created successfully", data: answer });
        }
        catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ message: "Validation error", errors: error });
            }
            console.error("Error creating evaluation answer:", error);
            res.status(500).json({
                message: "Error creating evaluation answer",
                error: error instanceof Error ? { message: error.message } : error
            });
        }
    };
    EvaluationAnswerController.updateAnswerHandler = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid answer ID" });
            }
            const parsedData = UpdateEvaluationAnswerSchema.parse(req.body);
            const answer = await EvaluationAnswerService.updateAnswer(id, parsedData);
            res
                .status(200)
                .json({ message: "Evaluation answer updated successfully", data: answer });
        }
        catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ message: "Validation error", errors: error });
            }
            console.error("Error updating evaluation answer:", error);
            res.status(500).json({
                message: "Error updating evaluation answer",
                error: error instanceof Error ? { message: error.message } : error
            });
        }
    };
    EvaluationAnswerController.deleteAnswerHandler = async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid answer ID" });
            }
            const answer = await EvaluationAnswerService.deleteAnswer(id);
            res
                .status(200)
                .json({ message: "Evaluation answer deleted successfully", data: answer });
        }
        catch (error) {
            console.error("Error deleting evaluation answer:", error);
            res.status(500).json({
                message: "Error deleting evaluation answer",
                error: error instanceof Error ? { message: error.message } : error
            });
        }
    };
})(EvaluationAnswerController || (EvaluationAnswerController = {}));
