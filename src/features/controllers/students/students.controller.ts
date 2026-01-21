import { CreateStudentSchema, UpdateStudentSchema } from "@/features/services/students/students.schema";
import { StudentService } from "@/features/services/students/students.service";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export namespace StudentController {
  export const getAllStudentsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string || "";
      const classroomId = req.query.classroomId ? parseInt(req.query.classroomId as string) : undefined;
      
      const result = await StudentService.getAllStudents(page, limit, search, classroomId);
      res
        .status(200)
        .json({ 
          message: "Students retrieved successfully", 
          data: result.students, 
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

  export const getStudentByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const studentId = parseInt(req.params.id);
        if (isNaN(studentId)) {
            return res.status(400).json({ message: "Invalid student ID" });
        }
        const student = await StudentService.getStudentById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student retrieved successfully", data: student });
    } catch (error: any) {
        next(error);
    }
  };

  export const createStudentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = CreateStudentSchema.parse(req.body);
      const student = await StudentService.createStudent(parsedData);
      res
        .status(201)
        .json({ message: "Student created successfully", data: student });
    } catch (error: any) {
      next(error);
    }
  };

  export const updateStudentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = parseInt(req.params.id);
      if (isNaN(studentId)) {
          return res.status(400).json({ message: "Invalid student ID" });
      }
      const parsedData = UpdateStudentSchema.parse(req.body);
      const student = await StudentService.updateStudent(studentId, parsedData);
      res
        .status(200)
        .json({ message: "Student updated successfully", data: student });
    } catch (error: any) {
      next(error);
    }
  };

  export const deleteStudentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = parseInt(req.params.id);
      if (isNaN(studentId)) {
          return res.status(400).json({ message: "Invalid student ID" });
      }
      const student = await StudentService.deleteStudent(studentId);
      res
        .status(200)
        .json({ message: "Student deleted successfully", data: student });
    } catch (error: any) {
      next(error);
    }
  };
}
