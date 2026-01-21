import { CreateLevelSchema, UpdateLevelSchema } from "@/features/services/levels/levels.schema.js";
import { LevelService } from "@/features/services/levels/levels.service.js";
import { levelRepository } from "@/features/repositories/levels/levels.repository.js";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export namespace LevelController {
  export const getAllLevelsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await LevelService.getAllLevels(page, limit);
      res
        .status(200)
        .json({ 
          message: "Levels retrieved successfully", 
          data: result.levels,
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

  export const getLevelByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid level ID" });
        }
        const level = await LevelService.getLevelById(id);
        if (!level) {
            return res.status(404).json({ message: "Level not found" });
        }
        res.status(200).json({ message: "Level retrieved successfully", data: level });
    } catch (error: any) {
        next(error);
    }
  };

  export const getLevelByNameHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name = req.query.name as string;
        if (!name) {
            return res.status(400).json({ message: "Level name is required" });
        }
        const level = await levelRepository.getLevelByName(name);
        if (!level) {
            return res.status(404).json({ message: "Level not found" });
        }
        res.status(200).json({ message: "Level retrieved successfully", data: level });
    } catch (error: any) {
        next(error);
    }
  };

  export const createLevelHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = CreateLevelSchema.parse(req.body);
      const level = await LevelService.createLevel(parsedData);
      res
        .status(201)
        .json({ message: "Level created successfully", data: level });
    } catch (error: any) {
      next(error);
    }
  };

  export const updateLevelHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid level ID" });
      }
      const parsedData = UpdateLevelSchema.parse(req.body);
      const level = await LevelService.updateLevel(id, parsedData);
      res
        .status(200)
        .json({ message: "Level updated successfully", data: level });
    } catch (error: any) {
      next(error);
    }
  };

  export const deleteLevelHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
          return res.status(400).json({ message: "Invalid level ID" });
      }
      const level = await LevelService.deleteLevel(id);
      res
        .status(200)
        .json({ message: "Level deleted successfully", data: level });
    } catch (error: any) {
      next(error);
    }
  };
}
