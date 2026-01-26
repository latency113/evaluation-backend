import prisma from "@/providers/database/database.provider.js";

export namespace courseAssignmentRepository {
    export const getAllAssignments = async (page: number = 1, limit: number = 10, searchTerm?: string, deptId?: number, classroomId?: number) => {
        const skip = (page - 1) * limit;
        const where: any = {};

        if (searchTerm) {
            where.OR = [
                { teacher: { first_name: { contains: searchTerm } } },
                { teacher: { last_name: { contains: searchTerm } } },
                { subject: { subject_name: { contains: searchTerm } } },
                { subject: { subject_code: { contains: searchTerm } } },
                { classroom: { room_name: { contains: searchTerm } } },
                { classroom: { level: { level_name: { contains: searchTerm } } } },
                { classroom: { department: { dept_name: { contains: searchTerm } } } }
            ];
        }

        if (deptId) {
            where.classroom = {
                OR: [
                    { dept_id: deptId },
                    { level: { dept_id: deptId } }
                ]
            };
        }

        if (classroomId) {
            where.classroom_id = classroomId;
        }

        return await prisma.courseAssignment.findMany({
            where,
            skip,
            take: limit,
            include: {
                teacher: true,
                subject: true,
                classroom: {
                    include: {
                        level: true,
                        department: true
                    }
                }
            },
            orderBy: { id: 'desc' }
        });
    }

    export const countAssignments = async (searchTerm?: string, deptId?: number, classroomId?: number) => {
        const where: any = {};

        if (searchTerm) {
            where.OR = [
                { teacher: { first_name: { contains: searchTerm } } },
                { teacher: { last_name: { contains: searchTerm } } },
                { subject: { subject_name: { contains: searchTerm } } },
                { subject: { subject_code: { contains: searchTerm } } },
                { classroom: { room_name: { contains: searchTerm } } },
                { classroom: { level: { level_name: { contains: searchTerm } } } },
                { classroom: { department: { dept_name: { contains: searchTerm } } } }
            ];
        }

        if (deptId) {
            where.classroom = {
                OR: [
                    { dept_id: deptId },
                    { level: { dept_id: deptId } }
                ]
            };
        }

        if (classroomId) {
            where.classroom_id = classroomId;
        }

        return await prisma.courseAssignment.count({ where });
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
                        level: true,
                        department: true
                    }
                }
            },
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

    

        export const findExisting = async (subjectId: number, teacherId: number, classroomId: number, term: string) => {

            return await prisma.courseAssignment.findFirst({

                where: {

                    subject_id: subjectId,

                    teacher_id: teacherId,

                    classroom_id: classroomId,

                    term: term

                }

            });

        }

    }

    