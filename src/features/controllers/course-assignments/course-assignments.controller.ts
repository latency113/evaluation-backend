import { CreateCourseAssignmentSchema, UpdateCourseAssignmentSchema } from "@/features/services/course-assignments/course-assignments.schema.js";
import { CourseAssignmentService } from "@/features/services/course-assignments/course-assignments.service.js";
import { NextFunction, Request, Response } from "express";

export namespace CourseAssignmentController {
  export const getAllAssignmentsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await CourseAssignmentService.getAllAssignments(page, limit, search);
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
      next(error);
    }
  };

  export const getAssignmentByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
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
        next(error);
    }
  };

  export const createAssignmentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = CreateCourseAssignmentSchema.parse(req.body);
      const assignment = await CourseAssignmentService.createAssignment(parsedData);
      res
        .status(201)
        .json({ message: "Course assignment created successfully", data: assignment });
    } catch (error: any) {
      next(error);
    }
  };

  export const updateAssignmentHandler = async (req: Request, res: Response, next: NextFunction) => {
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
      next(error);
    }
  };

  export const importAssignmentsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an Excel file" });
        }
        const result = await CourseAssignmentService.importFromExcel(req.file.buffer);
        
        let message = `สำเร็จ! นำเข้าใหม่ ${result.imported} รายการ (ข้ามรายการซ้ำ ${result.skipped})`;
        
        if (result.classroomNotFound > 0) {
            message += `\n❌ ไม่พบชื่อห้องเรียนในระบบ ${result.classroomNotFound} รายการ: ${result.missingRooms.join(', ')}`;
        }

        res.status(200).json({ 
            message: message,
            data: result 
        });
    } catch (error: any) {
        next(error);
    }
  };

  export const deleteAssignmentHandler = async (req: Request, res: Response, next: NextFunction) => {
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
      next(error);
    }
  };
}