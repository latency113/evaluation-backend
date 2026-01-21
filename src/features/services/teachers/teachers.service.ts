import { teacherRepository } from "../../repositories/teachers/teachers.repository";
import { UpdateTeacherInput, CreateTeacherInput, teacherSchema } from "./teachers.schema";

export namespace TeacherService {
    export const getAllTeachers = async (page: number = 1, limit: number = 10) => {
        const [teachers, total] = await Promise.all([
            teacherRepository.getAllTeachers(page, limit),
            teacherRepository.countTeachers()
        ]);

        return {
            teachers: teachers.map(teacher => teacherSchema.parse(teacher)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    export const getTeacherById = async (id: number) => {
        const teacher = await teacherRepository.getTeacherById(id);
        if (!teacher) return null;
        return teacherSchema.parse(teacher);
    }

    export const createTeacher = async (data: CreateTeacherInput) => {
        const newTeacher = await teacherRepository.createTeacher(data);
        return teacherSchema.parse(newTeacher);
    }

    export const updateTeacher = async (id: number, data: UpdateTeacherInput) => {
        const updatedTeacher = await teacherRepository.updateTeacher(id, data);
        return teacherSchema.parse(updatedTeacher);
    }

    export const deleteTeacher = async (id: number) => {
        const deletedTeacher = await teacherRepository.deleteTeacher(id);
        return teacherSchema.parse(deletedTeacher);
    }
}
