import { userRepository } from "../../repositories/users/users.repository.js";
import { UpdateUserInput, CreateUserInput, userSchema } from "./users.schema.js";
import bcrypt from "bcrypt";
import { Role } from "@/providers/database/generated/enums.js";

export namespace UserService {
    export const getAllUsers = async (page: number = 1, limit: number = 10) => {
        const [users, total] = await Promise.all([
            userRepository.getAllUsers(page, limit),
            userRepository.countUsers()
        ]);

        return {
            users: users.map(user => userSchema.parse({
                ...user,
                created_at: user.createdAt
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    export const getUserById = async (id: number) => {
        const user = await userRepository.getUserById(id);
        if (!user) return null;
        return userSchema.parse({
            ...user,
            created_at: user.createdAt
        });
    }

    export const createUser = async (data: CreateUserInput) => {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await userRepository.createUser({ 
            ...data, 
            password: hashedPassword,
            role: (data.role as any) || Role.admin,
            is_active: data.is_active ?? true,
            ref_id: data.ref_id ?? null
        });
        return userSchema.parse({
            ...newUser,
            created_at: newUser.createdAt
        });
    }

    export const updateUser = async (id: number, data: UpdateUserInput) => {
        const updateData: any = { ...data };
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        
        delete updateData.id;
        delete updateData.created_at;

        const updatedUser = await userRepository.updateUser(id, updateData);
        return userSchema.parse({
            ...updatedUser,
            created_at: updatedUser.createdAt
        });
    }

    export const deleteUser = async (id: number) => {
        const deletedUser = await userRepository.deleteUser(id);
        return userSchema.parse({
            ...deletedUser,
            created_at: deletedUser.createdAt
        });
    }
}