import { CreateCourseAssignmentSchema, UpdateCourseAssignmentSchema } from "@/features/services/course-assignments/course-assignments.schema.js";
import { CourseAssignmentService } from "@/features/services/course-assignments/course-assignments.service.js";
import { Request, Response } from "express";

export namespace CourseAssignmentController {
  export const getAllAssignmentsHandler = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await CourseAssignmentService.getAllAssignments(page, limit);
      res
        .status(200)
        .json({ 
          message: "Course assignments retrieved successfully", 
          data: result.assignments,
          meta: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
          }
        });
    } catch (error: any) {
      console.error("Error retrieving course assignments:", error);
      res.status(500).json({ 
          message: "Error retrieving course assignments", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const getAssignmentByIdHandler = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid assignment ID" });
        }
        const assignment = await CourseAssignmentService.getAssignmentById(id);
        if (!assignment) {
            return res.status(404).json({ message: "Course assignment not found" });
        }
        res.status(200).json({ message: "Course assignment retrieved successfully", data: assignment });
    } catch (error: any) {
        console.error("Error retrieving course assignment:", error);
        res.status(500).json({ 
            message: "Error retrieving course assignment", 
            error: error instanceof Error ? { message: error.message } : error 
        });
    }
  };

  export const createAssignmentHandler = async (req: Request, res: Response) => {
    try {
      const parsedData = CreateCourseAssignmentSchema.parse(req.body);
      const assignment = await CourseAssignmentService.createAssignment(parsedData);
      res
        .status(201)
        .json({ message: "Course assignment created successfully", data: assignment });
    } catch (error: any) {
      if (error) {
        return res.status(400).json({ message: "Validation error", errors: error });
      }
      console.error("Error creating course assignment:", error);
      res.status(500).json({ 
          message: "Error creating course assignment", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const updateAssignmentHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid assignment ID" });
      }
      const parsedData = UpdateCourseAssignmentSchema.parse(req.body);
      const assignment = await CourseAssignmentService.updateAssignment(id, parsedData);
      res
        .status(200)
        .json({ message: "Course assignment updated successfully", data: assignment });
    } catch (error: any) {
      if (error) {
        return res.status(400).json({ message: "Validation error", errors: error });
      }
      console.error("Error updating course assignment:", error);
      res.status(500).json({ 
          message: "Error updating course assignment", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const deleteAssignmentHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid assignment ID" });
      }
      const assignment = await CourseAssignmentService.deleteAssignment(id);
      res
        .status(200)
        .json({ message: "Course assignment deleted successfully", data: assignment });
    } catch (error: any) {
      console.error("Error deleting course assignment:", error);
      res.status(500).json({ 
          message: "Error deleting course assignment", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };
}
