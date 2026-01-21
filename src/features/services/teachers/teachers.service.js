import { teacherRepository } from "../../repositories/teachers/teachers.repository";
import { teacherSchema } from "./teachers.schema";
export var TeacherService;
(function (TeacherService) {
    TeacherService.getAllTeachers = async (page = 1, limit = 10) => {
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
    };
    TeacherService.getTeacherById = async (id) => {
        const teacher = await teacherRepository.getTeacherById(id);
        if (!teacher)
            return null;
        return teacherSchema.parse(teacher);
    };
    TeacherService.createTeacher = async (data) => {
        const newTeacher = await teacherRepository.createTeacher(data);
        return teacherSchema.parse(newTeacher);
    };
    TeacherService.updateTeacher = async (id, data) => {
        const updatedTeacher = await teacherRepository.updateTeacher(id, data);
        return teacherSchema.parse(updatedTeacher);
    };
    TeacherService.deleteTeacher = async (id) => {
        const deletedTeacher = await teacherRepository.deleteTeacher(id);
        return teacherSchema.parse(deletedTeacher);
    };
})(TeacherService || (TeacherService = {}));
