import prisma from "@/providers/database/database.provider.js";

export namespace evaluationRepository {
    export const getAllEvaluations = async (page: number = 1, limit: number = 10, studentId?: number, assignmentId?: number) => {
        const skip = (page - 1) * limit;
        const where: any = {};
        if (studentId) where.student_id = studentId;
        if (assignmentId) where.assignment_id = assignmentId;

        return await prisma.evaluation.findMany({
            where,
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

    export const getAllEvaluationsWithoutPagination = async (studentId?: number, assignmentId?: number) => {
        const where: any = {};
        if (studentId) where.student_id = studentId;
        if (assignmentId) where.assignment_id = assignmentId;

        return await prisma.evaluation.findMany({
            where,
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

    export const countEvaluations = async (studentId?: number, assignmentId?: number) => {
        const where: any = {};
        if (studentId) where.student_id = studentId;
        if (assignmentId) where.assignment_id = assignmentId;
        return await prisma.evaluation.count({ where });
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