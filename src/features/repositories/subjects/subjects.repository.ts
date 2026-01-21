import prisma from "@/providers/database/database.provider.js";

export namespace subjectRepository {
    export const getAllSubjects = async (page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.subject.findMany({
            skip,
            take: limit,
            orderBy: { id: 'desc' }
        });
    }

    export const countSubjects = async () => {
        return await prisma.subject.count();
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
