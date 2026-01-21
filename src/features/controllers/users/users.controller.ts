import { CreateUserSchema, UpdateUserSchema } from "@/features/services/users/users.schema";
import { UserService } from "@/features/services/users/users.service";
import { Request, Response } from "express";
import { ZodError } from "zod";

export namespace UserController {
  export const getAllUsersHandler = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await UserService.getAllUsers(page, limit);
      res
        .status(200)
        .json({ 
          message: "Users retrieved successfully", 
          data: result.users,
          meta: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
          }
        });
    } catch (error: any) {
      console.error("Error retrieving users:", error);
      res.status(500).json({ 
          message: "Error retrieving users", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const getUserByIdHandler = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }
        const user = await UserService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User retrieved successfully", data: user });
    } catch (error: any) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ 
            message: "Error retrieving user", 
            error: error instanceof Error ? { message: error.message } : error 
        });
    }
  };

  export const createUserHandler = async (req: Request, res: Response) => {
    try {
      const parsedData = CreateUserSchema.parse(req.body);
      const user = await UserService.createUser(parsedData);
      res
        .status(201)
        .json({ message: "User created successfully", data: user });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ 
          message: "Error creating user", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const updateUserHandler = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
          return res.status(400).json({ message: "Invalid user ID" });
      }
      const parsedData = UpdateUserSchema.parse(req.body);
      const user = await UserService.updateUser(userId, parsedData);
      res
        .status(200)
        .json({ message: "User updated successfully", data: user });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error });
      }
      console.error("Error updating user:", error);
      res.status(500).json({ 
          message: "Error updating user", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };

  export const deleteUserHandler = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
          return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await UserService.deleteUser(userId);
      res
        .status(200)
        .json({ message: "User deleted successfully", data: user });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      res.status(500).json({ 
          message: "Error deleting user", 
          error: error instanceof Error ? { message: error.message } : error 
      });
    }
  };
}
