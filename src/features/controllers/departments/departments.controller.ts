import { CreateDepartmentSchema, UpdateDepartmentSchema } from "@/features/services/departments/departments.schema";
import { DepartmentService } from "@/features/services/departments/departments.service";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export namespace DepartmentController {
  export const getAllDepartmentsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await DepartmentService.getAllDepartments(page, limit);
      res
        .status(200)
        .json({ 
          message: "Departments retrieved successfully", 
          data: result.departments,
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

  export const getDepartmentByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid department ID" });
        }
        const department = await DepartmentService.getDepartmentById(id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json({ message: "Department retrieved successfully", data: department });
    } catch (error: any) {
        next(error);
    }
  };

  export const getDepartmentByNameHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name = req.query.name as string;
        if (!name) {
            return res.status(400).json({ message: "Department name is required" });
        }
        const department = await departmentRepository.getDepartmentByName(name);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json({ message: "Department retrieved successfully", data: department });
    } catch (error: any) {
        next(error);
    }
  };

  export const createDepartmentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = CreateDepartmentSchema.parse(req.body);
      const department = await DepartmentService.createDepartment(parsedData);
      res
        .status(201)
        .json({ message: "Department created successfully", data: department });
    } catch (error: any) {
      next(error);
    }
  };

  export const updateDepartmentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid department ID" });
      }
      const parsedData = UpdateDepartmentSchema.parse(req.body);
      const department = await DepartmentService.updateDepartment(id, parsedData);
      res
        .status(200)
        .json({ message: "Department updated successfully", data: department });
    } catch (error: any) {
      next(error);
    }
  };

  export const deleteDepartmentHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid department ID" });
      }
      const department = await DepartmentService.deleteDepartment(id);
      res
        .status(200)
        .json({ message: "Department deleted successfully", data: department });
    } catch (error: any) {
      next(error);
    }
  };
}
