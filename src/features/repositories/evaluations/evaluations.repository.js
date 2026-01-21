import prisma from "@/providers/database/database.provider";
export var evaluationRepository;
(function (evaluationRepository) {
    evaluationRepository.getAllEvaluations = async (page = 1, limit = 10) => {
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
    };
    evaluationRepository.countEvaluations = async () => {
        return await prisma.evaluation.count();
    };
    evaluationRepository.getEvaluationById = async (id) => {
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
    };
    evaluationRepository.createEvaluation = async (data) => {
        return await prisma.evaluation.create({
            data: {
                assignment_id: data.assignment_id,
                student_id: data.student_id,
                suggestion: data.suggestion
            }
        });
    };
    evaluationRepository.updateEvaluation = async (id, data) => {
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
    };
    evaluationRepository.deleteEvaluation = async (id) => {
        return await prisma.evaluation.delete({
            where: {
                id: id
            }
        });
    };
})(evaluationRepository || (evaluationRepository = {}));
