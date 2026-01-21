import prisma from "@/providers/database/database.provider";
export var evaluationAnswerRepository;
(function (evaluationAnswerRepository) {
    evaluationAnswerRepository.getAllAnswers = async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.evaluationAnswer.findMany({
            skip,
            take: limit,
            include: {
                evaluation: true,
                question: true
            },
            orderBy: { id: 'desc' }
        });
    };
    evaluationAnswerRepository.countAnswers = async () => {
        return await prisma.evaluationAnswer.count();
    };
    evaluationAnswerRepository.getAnswerById = async (id) => {
        return await prisma.evaluationAnswer.findUnique({
            where: {
                id: id
            },
            include: {
                evaluation: true,
                question: true
            }
        });
    };
    evaluationAnswerRepository.createAnswer = async (data) => {
        return await prisma.evaluationAnswer.create({
            data: {
                eval_id: data.eval_id,
                question_id: data.question_id,
                score: data.score
            }
        });
    };
    evaluationAnswerRepository.updateAnswer = async (id, data) => {
        return await prisma.evaluationAnswer.update({
            where: {
                id: id
            },
            data: {
                eval_id: data.eval_id,
                question_id: data.question_id,
                score: data.score
            }
        });
    };
    evaluationAnswerRepository.deleteAnswer = async (id) => {
        return await prisma.evaluationAnswer.delete({
            where: {
                id: id
            }
        });
    };
})(evaluationAnswerRepository || (evaluationAnswerRepository = {}));
