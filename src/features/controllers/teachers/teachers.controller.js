import { CreateTeacherSchema, UpdateTeacherSchema } from "@/features/services/teachers/teachers.schema";
import { TeacherService } from "@/features/services/teachers/teachers.service";
import { teacherRepository } from "@/features/repositories/teachers/teachers.repository";
export var TeacherController;
(function (TeacherController) {
    TeacherController.getAllTeachersHandler = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await TeacherService.getAllTeachers(page, limit);
            res
                .status(200)
                .json({
                message: "Teachers retrieved successfully",
                data: result.teachers,
                meta: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages
                }
            });
        }
        catch (error) {
            next(error);
        }
    };
    TeacherController.getTeacherByIdHandler = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid teacher ID" });
            }
            const teacher = await TeacherService.getTeacherById(id);
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            res.status(200).json({ message: "Teacher retrieved successfully", data: teacher });
        }
        catch (error) {
            next(error);
        }
    };
    TeacherController.getTeacherByNameHandler = async (req, res, next) => {
        try {
            const firstName = req.query.firstName;
            const lastName = req.query.lastName;
            if (!firstName || !lastName) {
                return res.status(400).json({ message: "First name and last name are required" });
            }
            const teacher = await teacherRepository.getTeacherByName(firstName, lastName);
            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            res.status(200).json({ message: "Teacher retrieved successfully", data: teacher });
        }
        catch (error) {
            next(error);
        }
    };
    TeacherController.createTeacherHandler = async (req, res, next) => {
        try {
            const parsedData = CreateTeacherSchema.parse(req.body);
            const teacher = await TeacherService.createTeacher(parsedData);
            res
                .status(201)
                .json({ message: "Teacher created successfully", data: teacher });
        }
        catch (error) {
            next(error);
        }
    };
    TeacherController.updateTeacherHandler = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid teacher ID" });
            }
            const parsedData = UpdateTeacherSchema.parse(req.body);
            const teacher = await TeacherService.updateTeacher(id, parsedData);
            res
                .status(200)
                .json({ message: "Teacher updated successfully", data: teacher });
        }
        catch (error) {
            next(error);
        }
    };
    TeacherController.deleteTeacherHandler = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid teacher ID" });
            }
            const teacher = await TeacherService.deleteTeacher(id);
            res
                .status(200)
                .json({ message: "Teacher deleted successfully", data: teacher });
        }
        catch (error) {
            next(error);
        }
    };
})(TeacherController || (TeacherController = {}));
