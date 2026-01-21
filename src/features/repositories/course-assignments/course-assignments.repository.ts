import prisma from "@/providers/database/database.provider.js";

export namespace courseAssignmentRepository {
    export const getAllAssignments = async (page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.courseAssignment.findMany({
            skip,
            take: limit,
            include: {
                teacher: true,
                subject: true,
                classroom: {
                    include: {
                        level: true
                    }
                }
            },
            orderBy: { id: 'desc' }
        });
    }

    export const countAssignments = async () => {
        return await prisma.courseAssignment.count();
    }

    export const getAssignmentById = async (id: number) => {
        return await prisma.courseAssignment.findUnique({
            where: {
                id: id
            },
            include: {
                teacher: true,
                subject: true,
                classroom: {
                    include: {
                        level: true
                    }
                }
            }
        });
    }

    export const createAssignment = async (data: { 
        teacher_id?: number | null; 
        subject_id?: number | null; 
        classroom_id?: number | null; 
        term: string 
    }) => {
        return await prisma.courseAssignment.create({
            data: {
                teacher_id: data.teacher_id,
                subject_id: data.subject_id,
                classroom_id: data.classroom_id,
                term: data.term
            }
        });
    }

    export const updateAssignment = async (id: number, data: { 
        teacher_id?: number | null; 
        subject_id?: number | null; 
        classroom_id?: number | null; 
        term?: string 
    }) => {
        return await prisma.courseAssignment.update({
            where: {
                id: id
            },
            data: {
                teacher_id: data.teacher_id,
                subject_id: data.subject_id,
                classroom_id: data.classroom_id,
                term: data.term
            }
        });
    }

    export const deleteAssignment = async (id: number) => {
        return await prisma.courseAssignment.delete({
            where: {
                id: id
            }
        });
    }
}