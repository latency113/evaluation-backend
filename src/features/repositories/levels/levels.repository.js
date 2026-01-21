import prisma from "@/providers/database/database.provider";
export var levelRepository;
(function (levelRepository) {
    levelRepository.getAllLevels = async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.level.findMany({
            skip,
            take: limit,
            include: {
                department: true
            },
            orderBy: { id: 'desc' }
        });
    };
    levelRepository.countLevels = async () => {
        return await prisma.level.count();
    };
    levelRepository.getLevelById = async (id) => {
        return await prisma.level.findUnique({
            where: {
                id: id
            },
            include: {
                department: true
            }
        });
    };
    levelRepository.getLevelByName = async (name) => {
        return await prisma.level.findFirst({
            where: {
                level_name: name
            }
        });
    };
    levelRepository.createLevel = async (data) => {
        return await prisma.level.create({
            data: {
                level_name: data.level_name,
                dept_id: data.dept_id
            }
        });
    };
    levelRepository.updateLevel = async (id, data) => {
        return await prisma.level.update({
            where: {
                id: id
            },
            data: {
                level_name: data.level_name,
                dept_id: data.dept_id
            }
        });
    };
    levelRepository.deleteLevel = async (id) => {
        return await prisma.level.delete({
            where: {
                id: id
            }
        });
    };
})(levelRepository || (levelRepository = {}));
