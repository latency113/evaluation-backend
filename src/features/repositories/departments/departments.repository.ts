import prisma from "@/providers/database/database.provider.js";

export namespace departmentRepository {
    export const getAllDepartments = async (page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.department.findMany({
            skip,
            take: limit,
            orderBy: { id: 'desc' }
        });
    }

    export const getAllDepartmentsWithoutPagination = async () => {
        return await prisma.department.findMany({
            orderBy: { id: 'desc' }
        });
    }

    export const countDepartments = async () => {
        return await prisma.department.count();
    }

    export const getDepartmentById = async (id: number) => {
        return await prisma.department.findUnique({
            where: {
                id: id
            }
        });
    }

    export const getDepartmentByName = async (name: string) => {
        return await prisma.department.findFirst({
            where: {
                dept_name: name
            }
        });
    }

    export const createDepartment = async (data: { dept_name: string }) => {
        return await prisma.department.create({
            data: {
                dept_name: data.dept_name
            }
        });
    }

    export const updateDepartment = async (id: number, data: { dept_name?: string }) => {
        return await prisma.department.update({
            where: {
                id: id
            },
            data: {
                dept_name: data.dept_name
            }
        });
    }

    export const deleteDepartment = async (id: number) => {
        return await prisma.department.delete({
            where: {
                id: id
            }
        });
    }
}
