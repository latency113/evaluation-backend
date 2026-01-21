import prisma from "@/providers/database/database.provider";
export var courseAssignmentRepository;
(function (courseAssignmentRepository) {
    courseAssignmentRepository.getAllAssignments = async (page = 1, limit = 10) => {
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
    };
    courseAssignmentRepository.countAssignments = async () => {
        return await prisma.courseAssignment.count();
    };
    courseAssignmentRepository.getAssignmentById = async (id) => {
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
    };
    courseAssignmentRepository.createAssignment = async (data) => {
        return await prisma.courseAssignment.create({
            data: {
                teacher_id: data.teacher_id,
                subject_id: data.subject_id,
                classroom_id: data.classroom_id,
                term: data.term
            }
        });
    };
    courseAssignmentRepository.updateAssignment = async (id, data) => {
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
    };
    courseAssignmentRepository.deleteAssignment = async (id) => {
        return await prisma.courseAssignment.delete({
            where: {
                id: id
            }
        });
    };
})(courseAssignmentRepository || (courseAssignmentRepository = {}));
