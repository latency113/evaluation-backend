import { CreateClassroomSchema, UpdateClassroomSchema } from "@/features/services/classrooms/classrooms.schema.js";
import { ClassroomService } from "@/features/services/classrooms/classrooms.service.js";
import { classroomRepository } from "@/features/repositories/classrooms/classrooms.repository.js";
import { NextFunction, Request, Response } from "express";

export namespace ClassroomController {
  export const getAllClassroomsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const deptId = req.query.deptId ? parseInt(req.query.deptId as string) : undefined;

      const result = await ClassroomService.getAllClassrooms(page, limit, search, deptId);
      res
        .status(200)
        .json({ 
          message: "Classrooms retrieved successfully", 
          data: result.classrooms,
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

  export const getClassroomByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid classroom ID" });
        }
        const classroom = await ClassroomService.getClassroomById(id);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        res.status(200).json({ message: "Classroom retrieved successfully", data: classroom });
    } catch (error: any) {
        next(error);
    }
  };

  export const getClassroomByNameHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name = req.query.name as string;
        if (!name) {
            return res.status(400).json({ message: "Classroom name is required" });
        }
        const classroom = await classroomRepository.getClassroomByName(name);
        if (!classroom) {
            return res.status(404).json({ message: "Classroom not found" });
        }
        res.status(200).json({ message: "Classroom retrieved successfully", data: classroom });
    } catch (error: any) {
        next(error);
    }
  };

  export const createClassroomHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = CreateClassroomSchema.parse(req.body);
      const classroom = await ClassroomService.createClassroom(parsedData);
      res
        .status(201)
        .json({ message: "Classroom created successfully", data: classroom });
    } catch (error: any) {
      next(error);
    }
  };

  export const updateClassroomHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid classroom ID" });
      }
      const parsedData = UpdateClassroomSchema.parse(req.body);
      const classroom = await ClassroomService.updateClassroom(id, parsedData);
      res
        .status(200)
        .json({ message: "Classroom updated successfully", data: classroom });
    } catch (error: any) {
      next(error);
    }
  };

  export const deleteClassroomHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid classroom ID" });
      }
      const classroom = await ClassroomService.deleteClassroom(id);
      res
        .status(200)
        .json({ message: "Classroom deleted successfully", data: classroom });
    } catch (error: any) {
      next(error);
    }
  };

  export const importClassroomHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an Excel file" });
        }
        const results = await ClassroomService.importFromExcel(req.file.buffer);
        res.status(200).json({ 
            message: `Successfully imported ${results.length} sheets`, 
            data: results 
        });
    } catch (error: any) {
        next(error);
    }
  };
}