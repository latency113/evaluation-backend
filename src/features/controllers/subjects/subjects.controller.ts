import { CreateSubjectSchema, UpdateSubjectSchema } from "@/features/services/subjects/subjects.schema.js";
import { SubjectService } from "@/features/services/subjects/subjects.service.js";
import { NextFunction, Request, Response } from "express";

export namespace SubjectController {
    export const getAllSubjectsHandler = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
  
        const result = await SubjectService.getAllSubjects(page, limit, search);
        res
          .status(200)
          .json({ 
            message: "Subjects retrieved successfully", 
            data: result.subjects,
            meta: {
              total: result.total,
              page: result.page,
              limit: result.limit,
              totalPages: result.totalPages
            }
          });
      } catch (error: any) {
        next(error);
      }
    };
  
    export const importSubjectsHandler = async (req: Request, res: Response, next: NextFunction) => {
      try {
          if (!req.file) {
              return res.status(400).json({ message: "Please upload an Excel file" });
          }
          const result = await SubjectService.importFromExcel(req.file.buffer);
          res.status(200).json({ 
              message: `Successfully processed ${result.total} subjects. Imported ${result.imported} new items.`, 
              data: result 
          });
      } catch (error: any) {
          next(error);
      }
    };
  export const getSubjectByIdHandler = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid subject ID" });
        }
        const subject = await SubjectService.getSubjectById(id);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        res.status(200).json({ message: "Subject retrieved successfully", data: subject });
    } catch (error: any) {
        console.error("Error retrieving subject:", error);
        res.status(500).json({ 
            message: "Error retrieving subject", 
            error: error instanceof Error ? { message: error.message } : error 
        });
    }
  };

  export const createSubjectHandler = async (req: Request, res: Response) => {
    try {
      const parsedData = CreateSubjectSchema.parse(req.body);
      const subject = await SubjectService.createSubject(parsedData);
      res
        .status(201)
        .json({ message: "Subject created successfully", data: subject });
    } catch (error: any) {
      if (error) {
        return res.status(400).json({ message: "Validation error", errors: error });
      }
      console.error("Error creating subject:", error);
      res.status(500).json({ 
          message: "Error creating subject", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const updateSubjectHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid subject ID" });
      }
      const parsedData = UpdateSubjectSchema.parse(req.body);
      const subject = await SubjectService.updateSubject(id, parsedData);
      res
        .status(200)
        .json({ message: "Subject updated successfully", data: subject });
    } catch (error: any) {
      if (error) {
        return res.status(400).json({ message: "Validation error", errors: error });
      }
      console.error("Error updating subject:", error);
      res.status(500).json({ 
          message: "Error updating subject", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const deleteSubjectHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid subject ID" });
      }
      const subject = await SubjectService.deleteSubject(id);
      res
        .status(200)
        .json({ message: "Subject deleted successfully", data: subject });
    } catch (error: any) {
      console.error("Error deleting subject:", error);
      res.status(500).json({ 
          message: "Error deleting subject", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };
}
