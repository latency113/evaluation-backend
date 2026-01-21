import prisma from "@/providers/database/database.provider";
export var userRepository;
(function (userRepository) {
    userRepository.getAllUsers = async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return await prisma.user.findMany({
            skip,
            take: limit,
            orderBy: { id: 'desc' }
        });
    };
    userRepository.countUsers = async () => {
        return await prisma.user.count();
    };
    userRepository.getUserById = async (id) => {
        return await prisma.user.findUnique({
            where: {
                id: id
            }
        });
    };
    userRepository.getUserByUsername = async (username) => {
        return await prisma.user.findUnique({
            where: {
                username: username
            }
        });
    };
    userRepository.createUser = async (data) => {
        return await prisma.user.create({
            data: {
                username: data.username,
                password: data.password,
                role: data.role,
                ref_id: data.ref_id,
                is_active: data.is_active
            }
        });
    };
    userRepository.updateUser = async (id, data) => {
        return await prisma.user.update({
            where: {
                id: id
            },
            data: {
                username: data.username,
                password: data.password,
                role: data.role,
                ref_id: data.ref_id,
                is_active: data.is_active
            }
        });
    };
    userRepository.deleteUser = async (id) => {
        return await prisma.user.delete({
            where: {
                id: id
            }
        });
    };
})(userRepository || (userRepository = {}));
