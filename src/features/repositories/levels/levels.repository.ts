import prisma from "@/providers/database/database.provider.js";

export namespace levelRepository {
    export const getAllLevels = async (page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.level.findMany({
            skip,
                            take: limit,
                            include: {
                                department: true
                            },
                            orderBy: { level_name: 'asc' }
                        });
                    }
    export const getAllLevelsWithoutPagination = async () => {
        return await prisma.level.findMany({
            include: {
                department: true
            },
            orderBy: { level_name: 'asc' }
        });
    }

    export const countLevels = async () => {
        return await prisma.level.count();
    }

    export const getLevelById = async (id: number) => {
        return await prisma.level.findUnique({
            where: {
                id: id
            },
            include: {
                department: true
            }
        });
    }

    export const getLevelByName = async (name: string) => {
        return await prisma.level.findFirst({
            where: {
                level_name: name
            }
        });
    }

    export const createLevel = async (data: { level_name: string; dept_id?: number | null }) => {
        return await prisma.level.create({
            data: {
                level_name: data.level_name,
                dept_id: data.dept_id
            }
        });
    }

    export const updateLevel = async (id: number, data: { level_name?: string; dept_id?: number | null }) => {
        return await prisma.level.update({
            where: {
                id: id
            },
            data: {
                level_name: data.level_name,
                dept_id: data.dept_id
            }
        });
    }

    export const deleteLevel = async (id: number) => {
        return await prisma.level.delete({
            where: {
                id: id
            }
        });
    }
}
