import prisma from "@/providers/database/database.provider";

export namespace classroomRepository {
    export const getAllClassrooms = async (page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.classroom.findMany({
            skip,
            take: limit,
            include: {
                level: {
                    include: {
                        department: true
                    }
                }
            },
            orderBy: [
                { level: { department: { dept_name: 'asc' } } },
                { level: { level_name: 'asc' } },
                { room_name: 'asc' }
            ]
        });
    }

    export const countClassrooms = async () => {
        return await prisma.classroom.count();
    }

    export const getClassroomById = async (id: number) => {
        return await prisma.classroom.findUnique({
            where: {
                id: id
            },
            include: {
                level: {
                    include: {
                        department: true
                    }
                }
            }
        });
    }

    export const getClassroomByName = async (name: string) => {
        return await prisma.classroom.findFirst({
            where: {
                room_name: name
            }
        });
    }

    export const createClassroom = async (data: { room_name: string; level_id?: number | null }) => {
        return await prisma.classroom.create({
            data: {
                room_name: data.room_name,
                level_id: data.level_id
            }
        });
    }

    export const updateClassroom = async (id: number, data: { room_name?: string; level_id?: number | null }) => {
        return await prisma.classroom.update({
            where: {
                id: id
            },
            data: {
                room_name: data.room_name,
                level_id: data.level_id
            }
        });
    }

    export const deleteClassroom = async (id: number) => {
        return await prisma.classroom.delete({
            where: {
                id: id
            }
        });
    }

    export const createWithDependencies = async (data: {
        roomName: string;
        departmentName: string;
        levelName: string;
        teacherName: string;
        students: { studentCode: string; firstName: string; lastName: string }[];
    }) => {
        return await prisma.$transaction(async (tx) => {
            // 1. Find or Create Department
            let dept = await tx.department.findFirst({ where: { dept_name: data.departmentName } });
            if (!dept) {
                dept = await tx.department.create({ data: { dept_name: data.departmentName } });
            }

            // 2. Find or Create Level
            let level = await tx.level.findFirst({ where: { level_name: data.levelName, dept_id: dept.id } });
            if (!level) {
                level = await tx.level.create({ data: { level_name: data.levelName, dept_id: dept.id } });
            }

            // 3. Find or Create Teacher
            const nameParts = data.teacherName.split(/\s+/);
            const tFirstName = nameParts[0];
            const tLastName = nameParts.slice(1).join(' ') || '-';
            let teacher = await tx.teacher.findFirst({ where: { first_name: tFirstName, last_name: tLastName } });
            if (!teacher) {
                teacher = await tx.teacher.create({ data: { first_name: tFirstName, last_name: tLastName } });
            }

            // 4. Find or Create Classroom
            let classroom = await tx.classroom.findFirst({ where: { room_name: data.roomName, level_id: level.id } });
            if (!classroom) {
                classroom = await tx.classroom.create({ data: { room_name: data.roomName, level_id: level.id } });
            }

            // 5. Create/Update Students
            for (const s of data.students) {
                await tx.student.upsert({
                    where: { student_code: s.studentCode },
                    update: {
                        first_name: s.firstName,
                        last_name: s.lastName,
                        classroom_id: classroom.id
                    },
                    create: {
                        student_code: s.studentCode,
                        first_name: s.firstName,
                        last_name: s.lastName,
                        classroom_id: classroom.id
                    }
                });
            }

            return classroom;
        });
    }
}
