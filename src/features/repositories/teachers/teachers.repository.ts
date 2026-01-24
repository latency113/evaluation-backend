import prisma from "@/providers/database/database.provider.js";

export namespace teacherRepository {
    export const getAllTeachers = async (page: number = 1, limit: number = 10, searchTerm?: string) => {
        const skip = (page - 1) * limit;
        const where = searchTerm ? {
            OR: [
                { first_name: { contains: searchTerm } },
                { last_name: { contains: searchTerm } }
            ]
        } : {};

        return await prisma.teacher.findMany({
            where,
            skip,
            take: limit,
            orderBy: { id: 'asc' }
        });
    }

    export const countTeachers = async (searchTerm?: string) => {
        const where = searchTerm ? {
            OR: [
                { first_name: { contains: searchTerm } },
                { last_name: { contains: searchTerm } }
            ]
        } : {};
        return await prisma.teacher.count({ where });
    }

    export const getTeacherById = async (id: number) => {
        return await prisma.teacher.findUnique({
            where: {
                id: id
            }
        });
    }

    export const getTeacherByName = async (firstName: string, lastName: string = "-") => {
        const trimmedFirst = firstName?.trim() || "";
        const trimmedLast = (lastName || "-").trim();
        
        // If lastName is empty or "-", search for any teacher with this first name
        if (!trimmedLast || trimmedLast === "-") {
            return await prisma.teacher.findFirst({
                where: {
                    OR: [
                        { first_name: { equals: trimmedFirst } },
                        { first_name: { endsWith: trimmedFirst } }
                    ]
                },
                orderBy: {
                    last_name: 'desc' // Prefer non-empty last names
                }
            });
        }

        return await prisma.teacher.findFirst({
            where: {
                OR: [
                    { first_name: { equals: trimmedFirst } },
                    { first_name: { endsWith: trimmedFirst } }
                ],
                last_name: { equals: trimmedLast }
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
