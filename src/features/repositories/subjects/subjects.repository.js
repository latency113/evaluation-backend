import prisma from "@/providers/database/database.provider";
export var subjectRepository;
(function (subjectRepository) {
    subjectRepository.getAllSubjects = async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.subject.findMany({
            skip,
            take: limit,
            orderBy: { id: 'desc' }
        });
    };
    subjectRepository.countSubjects = async () => {
        return await prisma.subject.count();
    };
    subjectRepository.getSubjectById = async (id) => {
        return await prisma.subject.findUnique({
            where: {
                id: id
            }
        });
    };
    subjectRepository.createSubject = async (data) => {
        return await prisma.subject.create({
            data: {
                subject_code: data.subject_code,
                subject_name: data.subject_name
            }
        });
    };
    subjectRepository.updateSubject = async (id, data) => {
        return await prisma.subject.update({
            where: {
                id: id
            },
            data: {
                subject_code: data.subject_code,
                subject_name: data.subject_name
            }
        });
    };
    subjectRepository.deleteSubject = async (id) => {
        return await prisma.subject.delete({
            where: {
                id: id
            }
        });
    };
})(subjectRepository || (subjectRepository = {}));
