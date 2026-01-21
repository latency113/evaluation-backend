import prisma from "@/providers/database/database.provider";
export var evaluationQuestionRepository;
(function (evaluationQuestionRepository) {
    evaluationQuestionRepository.getAllQuestions = async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.evaluationQuestion.findMany({
            skip,
            take: limit,
            orderBy: { id: 'asc' }
        });
    };
    evaluationQuestionRepository.countQuestions = async () => {
        return await prisma.evaluationQuestion.count();
    };
    evaluationQuestionRepository.getQuestionById = async (id) => {
        return await prisma.evaluationQuestion.findUnique({
            where: {
                id: id
            }
        });
    };
    evaluationQuestionRepository.createQuestion = async (data) => {
        return await prisma.evaluationQuestion.create({
            data: {
                question_text: data.question_text
            }
        });
    };
    evaluationQuestionRepository.updateQuestion = async (id, data) => {
        return await prisma.evaluationQuestion.update({
            where: {
                id: id
            },
            data: {
                question_text: data.question_text
            }
        });
    };
    evaluationQuestionRepository.deleteQuestion = async (id) => {
        return await prisma.evaluationQuestion.delete({
            where: {
                id: id
            }
        });
    };
})(evaluationQuestionRepository || (evaluationQuestionRepository = {}));
