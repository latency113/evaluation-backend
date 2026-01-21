import prisma from "@/providers/database/database.provider";

export namespace evaluationRepository {
    export const getAllEvaluations = async (page: number = 1, limit: number = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.evaluation.findMany({
            skip,
            take: limit,
            include: {
                assignment: {
                    include: {
                        subject: true,
                        teacher: true,
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
                },
                student: {
                    include: {
                        classroom: true
                    }
                },
                answers: {
                    include: {
                        question: true
                    }
                }
            },
            orderBy: { eval_date: 'desc' }
        });
    }

    export const countEvaluations = async () => {
        return await prisma.evaluation.count();
    }

    export const getEvaluationById = async (id: number) => {
        return await prisma.evaluation.findUnique({
            where: {
                id: id
            },
            include: {
                assignment: {
                    include: {
                        subject: true,
                        teacher: true,
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
                },
                student: {
                    include: {
                        classroom: true
                    }
                },
                answers: {
                    include: {
                        question: true
                    }
                }
            }
        });
    }

    export const createEvaluation = async (data: { 
        assignment_id?: number | null; 
        student_id?: number | null; 
        suggestion?: string | null 
    }) => {
        return await prisma.evaluation.create({
            data: {
                assignment_id: data.assignment_id,
                student_id: data.student_id,
                suggestion: data.suggestion
            }
        });
    }

    export const updateEvaluation = async (id: number, data: { 
        assignment_id?: number | null; 
        student_id?: number | null; 
        suggestion?: string | null 
    }) => {
        return await prisma.evaluation.update({
            where: {
                id: id
            },
            data: {
                assignment_id: data.assignment_id,
                student_id: data.student_id,
                suggestion: data.suggestion
            }
        });
    }

    export const deleteEvaluation = async (id: number) => {
        return await prisma.evaluation.delete({
            where: {
                id: id
            }
        });
    }
}