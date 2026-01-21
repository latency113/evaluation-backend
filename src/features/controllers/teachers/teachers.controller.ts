import { CreateTeacherSchema, UpdateTeacherSchema } from "@/features/services/teachers/teachers.schema.js";
import { TeacherService } from "@/features/services/teachers/teachers.service.js";
import { teacherRepository } from "@/features/repositories/teachers/teachers.repository.js";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export namespace TeacherController {
  export const getAllTeachersHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await TeacherService.getAllTeachers(page, limit);
      res
        .status(200)
        .json({ 
          message: "Teachers retrieved successfully", 
          data: result.teachers,
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

  export const getTeacherByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid teacher ID" });
        }
        const teacher = await TeacherService.getTeacherById(id);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json({ message: "Teacher retrieved successfully", data: teacher });
    } catch (error: any) {
        next(error);
    }
  };

  export const getTeacherByNameHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const firstName = req.query.firstName as string;
        const lastName = req.query.lastName as string;
        if (!firstName || !lastName) {
            return res.status(400).json({ message: "First name and last name are required" });
        }
        const teacher = await teacherRepository.getTeacherByName(firstName, lastName);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json({ message: "Teacher retrieved successfully", data: teacher });
    } catch (error: any) {
        next(error);
    }
  };

  export const createTeacherHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = CreateTeacherSchema.parse(req.body);
      const teacher = await TeacherService.createTeacher(parsedData);
      res
        .status(201)
        .json({ message: "Teacher created successfully", data: teacher });
    } catch (error: any) {
      next(error);
    }
  };

  export const updateTeacherHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid teacher ID" });
      }
      const parsedData = UpdateTeacherSchema.parse(req.body);
      const teacher = await TeacherService.updateTeacher(id, parsedData);
      res
        .status(200)
        .json({ message: "Teacher updated successfully", data: teacher });
    } catch (error: any) {
      next(error);
    }
  };

  export const deleteTeacherHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid teacher ID" });
      }
      const teacher = await TeacherService.deleteTeacher(id);
      res
        .status(200)
        .json({ message: "Teacher deleted successfully", data: teacher });
    } catch (error: any) {
      next(error);
    }
  };
}
