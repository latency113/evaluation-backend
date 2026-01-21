import { CreateEvaluationQuestionSchema, UpdateEvaluationQuestionSchema } from "@/features/services/evaluation-questions/evaluation-questions.schema.js";
import { EvaluationQuestionService } from "@/features/services/evaluation-questions/evaluation-questions.service.js";
import { Request, Response } from "express";

export namespace EvaluationQuestionController {
  export const getAllQuestionsHandler = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

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
    } catch (error: any) {
      console.error("Error retrieving evaluation questions:", error);
      res.status(500).json({ 
          message: "Error retrieving evaluation questions", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const getQuestionByIdHandler = async (req: Request, res: Response) => {
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
    } catch (error: any) {
        console.error("Error retrieving evaluation question:", error);
        res.status(500).json({ 
            message: "Error retrieving evaluation question", 
            error: error instanceof Error ? { message: error.message } : error 
        });
    }
  };

  export const createQuestionHandler = async (req: Request, res: Response) => {
    try {
      const parsedData = CreateEvaluationQuestionSchema.parse(req.body);
      const question = await EvaluationQuestionService.createQuestion(parsedData);
      res
        .status(201)
        .json({ message: "Evaluation question created successfully", data: question });
    } catch (error: any) {
      if (error) {
        return res.status(400).json({ message: "Validation error", errors: error });
      }
      console.error("Error creating evaluation question:", error);
      res.status(500).json({ 
          message: "Error creating evaluation question", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const updateQuestionHandler = async (req: Request, res: Response) => {
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
    } catch (error: any) {
      if (error) {
        return res.status(400).json({ message: "Validation error", errors: error });
      }
      console.error("Error updating evaluation question:", error);
      res.status(500).json({ 
          message: "Error updating evaluation question", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const deleteQuestionHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid question ID" });
      }
      const question = await EvaluationQuestionService.deleteQuestion(id);
      res
        .status(200)
        .json({ message: "Evaluation question deleted successfully", data: question });
    } catch (error: any) {
      console.error("Error deleting evaluation question:", error);
      res.status(500).json({ 
          message: "Error deleting evaluation question", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };
}
