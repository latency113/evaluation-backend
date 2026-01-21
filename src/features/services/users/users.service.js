import { userRepository } from "../../repositories/users/users.repository";
import { userSchema } from "./users.schema";
import bcrypt from "bcrypt";
import { Role } from "@/providers/database/generated/enums";
export var UserService;
(function (UserService) {
    UserService.getAllUsers = async (page = 1, limit = 10) => {
        const [users, total] = await Promise.all([
            userRepository.getAllUsers(page, limit),
            userRepository.countUsers()
        ]);
        return {
            users: users.map(user => userSchema.parse({
                ...user,
                created_at: user.createdAt
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    };
    UserService.getUserById = async (id) => {
        const user = await userRepository.getUserById(id);
        if (!user)
            return null;
        return userSchema.parse({
            ...user,
            created_at: user.createdAt
        });
    };
    UserService.createUser = async (data) => {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await userRepository.createUser({
            ...data,
            password: hashedPassword,
            role: data.role || Role.admin,
            is_active: data.is_active ?? true,
            ref_id: data.ref_id ?? null
        });
        return userSchema.parse({
            ...newUser,
            created_at: newUser.createdAt
        });
    };
    UserService.updateUser = async (id, data) => {
        const updateData = { ...data };
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        delete updateData.id;
        delete updateData.created_at;
        const updatedUser = await userRepository.updateUser(id, updateData);
        return userSchema.parse({
            ...updatedUser,
            created_at: updatedUser.createdAt
        });
    };
    UserService.deleteUser = async (id) => {
        const deletedUser = await userRepository.deleteUser(id);
        return userSchema.parse({
            ...deletedUser,
            created_at: deletedUser.createdAt
        });
    };
})(UserService || (UserService = {}));
