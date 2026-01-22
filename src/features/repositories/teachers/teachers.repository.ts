import prisma from "@/providers/database/database.provider.js";

export namespace teacherRepository {
    export const getAllTeachers = async (page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.teacher.findMany({
            skip,
            take: limit,
            orderBy: { id: 'asc' }
        });
    }

    export const countTeachers = async () => {
        return await prisma.teacher.count();
    }

    export const getTeacherById = async (id: number) => {
        return await prisma.teacher.findUnique({
            where: {
                id: id
            }
        });
    }

    export const getTeacherByName = async (firstName: string, lastName: string) => {
        return await prisma.teacher.findFirst({
            where: {
                first_name: firstName,
                last_name: lastName
            }
        });
    }

    export const createTeacher = async (data: { first_name: string; last_name: string }) => {
        return await prisma.teacher.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name
            }
        });
    }

    export const updateTeacher = async (id: number, data: { first_name?: string; last_name?: string }) => {
        return await prisma.teacher.update({
            where: {
                id: id
            },
            data: {
                first_name: data.first_name,
                last_name: data.last_name
            }
        });
    }

    export const deleteTeacher = async (id: number) => {
        return await prisma.teacher.delete({
            where: {
                id: id
            }
        });
    }
}
