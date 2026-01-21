import prisma from "@/providers/database/database.provider";
export var studentRepository;
(function (studentRepository) {
    studentRepository.getAllStudents = async (page = 1, limit = 10, search = "", classroomId) => {
        const skip = (page - 1) * limit;
        const where = {};
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
            }
            else {
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
    };
    studentRepository.countStudents = async (search = "", classroomId) => {
        const where = {};
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
            }
            else {
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
    };
    studentRepository.getStudentById = async (id) => {
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
    };
    studentRepository.createStudent = async (data) => {
        return await prisma.student.create({
            data: {
                student_code: data.student_code,
                first_name: data.first_name,
                last_name: data.last_name,
                classroom_id: data.classroom_id
            }
        });
    };
    studentRepository.updateStudent = async (id, data) => {
        return await prisma.student.update({
            where: { id: id },
            data: {
                student_code: data.student_code,
                first_name: data.first_name,
                last_name: data.last_name,
                classroom_id: data.classroom_id
            }
        });
    };
    studentRepository.deleteStudent = async (id) => {
        return await prisma.student.delete({
            where: { id: id }
        });
    };
})(studentRepository || (studentRepository = {}));
