import { CreateClassroomSchema, UpdateClassroomSchema } from "@/features/services/classrooms/classrooms.schema";
import { ClassroomService } from "@/features/services/classrooms/classrooms.service";
import { classroomRepository } from "@/features/repositories/classrooms/classrooms.repository";
export var ClassroomController;
(function (ClassroomController) {
    ClassroomController.getAllClassroomsHandler = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await ClassroomService.getAllClassrooms(page, limit);
            res
                .status(200)
                .json({
                message: "Classrooms retrieved successfully",
                data: result.classrooms,
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
    ClassroomController.getClassroomByIdHandler = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid classroom ID" });
            }
            const classroom = await ClassroomService.getClassroomById(id);
            if (!classroom) {
                return res.status(404).json({ message: "Classroom not found" });
            }
            res.status(200).json({ message: "Classroom retrieved successfully", data: classroom });
        }
        catch (error) {
            next(error);
        }
    };
    ClassroomController.getClassroomByNameHandler = async (req, res, next) => {
        try {
            const name = req.query.name;
            if (!name) {
                return res.status(400).json({ message: "Classroom name is required" });
            }
            const classroom = await classroomRepository.getClassroomByName(name);
            if (!classroom) {
                return res.status(404).json({ message: "Classroom not found" });
            }
            res.status(200).json({ message: "Classroom retrieved successfully", data: classroom });
        }
        catch (error) {
            next(error);
        }
    };
    ClassroomController.createClassroomHandler = async (req, res, next) => {
        try {
            const parsedData = CreateClassroomSchema.parse(req.body);
            const classroom = await ClassroomService.createClassroom(parsedData);
            res
                .status(201)
                .json({ message: "Classroom created successfully", data: classroom });
        }
        catch (error) {
            next(error);
        }
    };
    ClassroomController.updateClassroomHandler = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid classroom ID" });
            }
            const parsedData = UpdateClassroomSchema.parse(req.body);
            const classroom = await ClassroomService.updateClassroom(id, parsedData);
            res
                .status(200)
                .json({ message: "Classroom updated successfully", data: classroom });
        }
        catch (error) {
            next(error);
        }
    };
    ClassroomController.deleteClassroomHandler = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid classroom ID" });
            }
            const classroom = await ClassroomService.deleteClassroom(id);
            res
                .status(200)
                .json({ message: "Classroom deleted successfully", data: classroom });
        }
        catch (error) {
            next(error);
        }
    };
    ClassroomController.importClassroomHandler = async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Please upload an Excel file" });
            }
            const results = await ClassroomService.importFromExcel(req.file.buffer);
            res.status(200).json({
                message: `Successfully imported ${results.length} sheets`,
                data: results
            });
        }
        catch (error) {
            next(error);
        }
    };
})(ClassroomController || (ClassroomController = {}));
