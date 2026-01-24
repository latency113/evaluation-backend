import prisma from "@/providers/database/database.provider.js";

export namespace subjectRepository {
    export const getAllSubjects = async (page: number = 1, limit: number = 10, searchTerm?: string) => {
        const skip = (page - 1) * limit;
        const where = searchTerm ? {
            OR: [
                { subject_code: { contains: searchTerm } },
                { subject_name: { contains: searchTerm } }
            ]
        } : {};

        return await prisma.subject.findMany({
            where,
            skip,
            take: limit,
            orderBy: { id: 'desc' }
        });
    }

    export const countSubjects = async (searchTerm?: string) => {
        const where = searchTerm ? {
            OR: [
                { subject_code: { contains: searchTerm } },
                { subject_name: { contains: searchTerm } }
            ]
        } : {};
        return await prisma.subject.count({ where });
    }

    export const getSubjectByCode = async (code: string) => {
        return await prisma.subject.findUnique({
            where: {
                subject_code: code
            }
        });
    }

    export const getSubjectById = async (id: number) => {
        return await prisma.subject.findUnique({
            where: {
                id: id
            }
        });
    }

    export const createSubject = async (data: { subject_code: string; subject_name: string }) => {
        return await prisma.subject.create({
            data: {
                subject_code: data.subject_code,
                subject_name: data.subject_name
            }
        });
    }

    export const updateSubject = async (id: number, data: { subject_code?: string; subject_name?: string }) => {
        return await prisma.subject.update({
            where: {
                id: id
            },
            data: {
                subject_code: data.subject_code,
                subject_name: data.subject_name
            }
        });
    }

    export const deleteSubject = async (id: number) => {
        return await prisma.subject.delete({
            where: {
                id: id
            }
        });
    }
}
