import prisma from "@/providers/database/database.provider";
export var teacherRepository;
(function (teacherRepository) {
    teacherRepository.getAllTeachers = async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.teacher.findMany({
            skip,
            take: limit,
            orderBy: { id: 'desc' }
        });
    };
    teacherRepository.countTeachers = async () => {
        return await prisma.teacher.count();
    };
    teacherRepository.getTeacherById = async (id) => {
        return await prisma.teacher.findUnique({
            where: {
                id: id
            }
        });
    };
    teacherRepository.getTeacherByName = async (firstName, lastName) => {
        return await prisma.teacher.findFirst({
            where: {
                first_name: firstName,
                last_name: lastName
            }
        });
    };
    teacherRepository.createTeacher = async (data) => {
        return await prisma.teacher.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name
            }
        });
    };
    teacherRepository.updateTeacher = async (id, data) => {
        return await prisma.teacher.update({
            where: {
                id: id
            },
            data: {
                first_name: data.first_name,
                last_name: data.last_name
            }
        });
    };
    teacherRepository.deleteTeacher = async (id) => {
        return await prisma.teacher.delete({
            where: {
                id: id
            }
        });
    };
})(teacherRepository || (teacherRepository = {}));
