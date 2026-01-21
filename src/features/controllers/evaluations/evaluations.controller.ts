import { CreateEvaluationSchema, UpdateEvaluationSchema } from "@/features/services/evaluations/evaluations.schema";
import { EvaluationService } from "@/features/services/evaluations/evaluations.service";
import { Request, Response } from "express";
import { ZodError } from "zod";

export namespace EvaluationController {
  export const getAllEvaluationsHandler = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await EvaluationService.getAllEvaluations(page, limit);
      res
        .status(200)
        .json({ 
          message: "Evaluations retrieved successfully", 
          data: result.evaluations,
          meta: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
          }
        });
    } catch (error: any) {
      console.error("Error retrieving evaluations:", error);
      res.status(500).json({ 
          message: "Error retrieving evaluations", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const getEvaluationByIdHandler = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid evaluation ID" });
        }
        const evaluation = await EvaluationService.getEvaluationById(id);
        if (!evaluation) {
            return res.status(404).json({ message: "Evaluation not found" });
        }
        res.status(200).json({ message: "Evaluation retrieved successfully", data: evaluation });
    } catch (error: any) {
        console.error("Error retrieving evaluation:", error);
        res.status(500).json({ 
            message: "Error retrieving evaluation", 
            error: error instanceof Error ? { message: error.message } : error 
        });
    }
  };

  export const createEvaluationHandler = async (req: Request, res: Response) => {
    try {
      const parsedData = CreateEvaluationSchema.parse(req.body);
      const evaluation = await EvaluationService.createEvaluation(parsedData);
      res
        .status(201)
        .json({ message: "Evaluation created successfully", data: evaluation });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error });
      }
      console.error("Error creating evaluation:", error);
      res.status(500).json({ 
          message: "Error creating evaluation", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const updateEvaluationHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid evaluation ID" });
      }
      const parsedData = UpdateEvaluationSchema.parse(req.body);
      const evaluation = await EvaluationService.updateEvaluation(id, parsedData);
      res
        .status(200)
        .json({ message: "Evaluation updated successfully", data: evaluation });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error });
      }
      console.error("Error updating evaluation:", error);
      res.status(500).json({ 
          message: "Error updating evaluation", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const deleteEvaluationHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid evaluation ID" });
      }
      const evaluation = await EvaluationService.deleteEvaluation(id);
      res
        .status(200)
        .json({ message: "Evaluation deleted successfully", data: evaluation });
    } catch (error: any) {
      console.error("Error deleting evaluation:", error);
      res.status(500).json({ 
          message: "Error deleting evaluation", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };
}
