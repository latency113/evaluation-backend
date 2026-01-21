import prisma from "@/providers/database/database.provider.js";

export namespace evaluationAnswerRepository {
    export const getAllAnswers = async (page: number = 1, limit: number = 10) => {
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
    }

    export const countAnswers = async () => {
        return await prisma.evaluationAnswer.count();
    }

    export const getAnswerById = async (id: number) => {
        return await prisma.evaluationAnswer.findUnique({
            where: {
                id: id
            },
            include: {
                evaluation: true,
                question: true
            }
        });
    }

    export const createAnswer = async (data: { 
        eval_id?: number | null; 
        question_id?: number | null; 
        score: number 
    }) => {
        return await prisma.evaluationAnswer.create({
            data: {
                eval_id: data.eval_id,
                question_id: data.question_id,
                score: data.score
            }
        });
    }

    export const updateAnswer = async (id: number, data: { 
        eval_id?: number | null; 
        question_id?: number | null; 
        score?: number 
    }) => {
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
    }

    export const deleteAnswer = async (id: number) => {
        return await prisma.evaluationAnswer.delete({
            where: {
                id: id
            }
        });
    }
}
