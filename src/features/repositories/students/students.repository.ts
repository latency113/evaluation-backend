import prisma from "@/providers/database/database.provider.js";

export namespace studentRepository {
    export const getAllStudents = async (page: number = 1, limit: number = 10, search: string = "", classroomId?: number) => {
        const skip = (page - 1) * limit;
        
        const where: any = {};
        if (search) {
            const searchTerms = search.trim().split(/\s+/);
            
            if (searchTerms.length > 1) {
                // กรณีมีการเว้นวรรค เช่น "สมชาย ใจดี"
                where.AND = searchTerms.map(term => ({
                    OR: [
                        { student_code: { contains: term } },
                        { first_name: { contains: term } },
                        { last_name: { contains: term } },
                    ]
                }));
            } else {
                // กรณีคำเดียว
                where.OR = [
                    { student_code: { contains: search } },
                    { first_name: { contains: search } },
                    { last_name: { contains: search } },
                ];
            }
        }
        if (classroomId) {
            where.classroom_id = classroomId;
        }

        return await prisma.student.findMany({
            where,
            skip: skip,
            take: limit,
            include: {
                classroom: {
                    include: {
                        level: {
                            include: {
                                department: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                student_code: 'asc'
            }
        });
    }

    export const countStudents = async (search: string = "", classroomId?: number) => {
        const where: any = {};
        if (search) {
            const searchTerms = search.trim().split(/\s+/);
            if (searchTerms.length > 1) {
                where.AND = searchTerms.map(term => ({
                    OR: [
                        { student_code: { contains: term } },
                        { first_name: { contains: term } },
                        { last_name: { contains: term } },
                    ]
                }));
            } else {
                where.OR = [
                    { student_code: { contains: search } },
                    { first_name: { contains: search } },
                    { last_name: { contains: search } },
                ];
            }
        }
        if (classroomId) {
            where.classroom_id = classroomId;
        }
        return await prisma.student.count({ where });
    }

    export const getStudentById = async (id: number) => {
        return await prisma.student.findUnique({
            where: { id: id },
            include: { 
                classroom: {
                    include: {
                        level: {
                            include: {
                                department: true
                            }
                        }
                    }
                } 
            }
        });
    }

    export const createStudent = async (data: { 
        student_code: string; 
        first_name: string; 
        last_name: string; 
        classroom_id?: number | null 
    }) => {
        return await prisma.student.create({
            data: {
                student_code: data.student_code,
                first_name: data.first_name,
                last_name: data.last_name,
                classroom_id: data.classroom_id
            }
        });
    }

    export const updateStudent = async (id: number, data: { 
        student_code?: string; 
        first_name?: string; 
        last_name?: string; 
        classroom_id?: number | null 
    }) => {
        return await prisma.student.update({
            where: { id: id },
            data: {
                student_code: data.student_code,
                first_name: data.first_name,
                last_name: data.last_name,
                classroom_id: data.classroom_id
            }
        });
    }

    export const deleteStudent = async (id: number) => {
        return await prisma.student.delete({
            where: { id: id }
        });
    }
}
