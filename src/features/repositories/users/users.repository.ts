import prisma from "@/providers/database/database.provider";
import { Role } from "@/providers/database/generated/enums";

export namespace userRepository {
    export const getAllUsers = async (page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.user.findMany({
            skip,
            take: limit,
            orderBy: { id: 'desc' }
        });
    }

    export const countUsers = async () => {
        return await prisma.user.count();
    }

    export const getUserById = async (id: number) => {
        return await prisma.user.findUnique({
            where: {
                id: id
            }
        });
    }

    export const getUserByUsername = async (username: string) => {
        return await prisma.user.findUnique({
            where: {
                username: username
            }
        });
    }

    export const createUser = async (data: { 
        username: string; 
        password: string; 
        role: Role; 
        ref_id?: number | null; 
        is_active?: boolean 
    }) => {
        return await prisma.user.create({
            data: {
                username: data.username,
                password: data.password,
                role: data.role as any,
                ref_id: data.ref_id,
                is_active: data.is_active
            }
        });
    }

    export const updateUser = async (id: number, data: { 
        username?: string; 
        password?: string; 
        role?: Role; 
        ref_id?: number | null; 
        is_active?: boolean 
    }) => {
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                username: data.username,
                password: data.password,
                role: data.role as any,
                ref_id: data.ref_id,
                is_active: data.is_active
            }
        });
    }

    export const deleteUser = async (id: number) => {
        return await prisma.user.delete({
            where: {
                id: id
            }
        });
    }
}