import prisma from "@/providers/database/database.provider";

export namespace evaluationQuestionRepository {
    export const getAllQuestions = async (page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.evaluationQuestion.findMany({
            skip,
            take: limit,
            orderBy: { id: 'asc' }
        });
    }

    export const countQuestions = async () => {
        return await prisma.evaluationQuestion.count();
    }

    export const getQuestionById = async (id: number) => {
        return await prisma.evaluationQuestion.findUnique({
            where: {
                id: id
            }
        });
    }

    export const createQuestion = async (data: { question_text: string }) => {
        return await prisma.evaluationQuestion.create({
            data: {
                question_text: data.question_text
            }
        });
    }

    export const updateQuestion = async (id: number, data: { question_text?: string }) => {
        return await prisma.evaluationQuestion.update({
            where: {
                id: id
            },
            data: {
                question_text: data.question_text
            }
        });
    }

    export const deleteQuestion = async (id: number) => {
        return await prisma.evaluationQuestion.delete({
            where: {
                id: id
            }
        });
    }
}
