import { CreateDepartmentSchema, UpdateDepartmentSchema } from "@/features/services/departments/departments.schema";
import { DepartmentService } from "@/features/services/departments/departments.service";
export var DepartmentController;
(function (DepartmentController) {
    DepartmentController.getAllDepartmentsHandler = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await DepartmentService.getAllDepartments(page, limit);
            res
                .status(200)
                .json({
                message: "Departments retrieved successfully",
                data: result.departments,
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
    DepartmentController.getDepartmentByIdHandler = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid department ID" });
            }
            const department = await DepartmentService.getDepartmentById(id);
            if (!department) {
                return res.status(404).json({ message: "Department not found" });
            }
            res.status(200).json({ message: "Department retrieved successfully", data: department });
        }
        catch (error) {
            next(error);
        }
    };
    DepartmentController.getDepartmentByNameHandler = async (req, res, next) => {
        try {
            const name = req.query.name;
            if (!name) {
                return res.status(400).json({ message: "Department name is required" });
            }
            const department = await departmentRepository.getDepartmentByName(name);
            if (!department) {
                return res.status(404).json({ message: "Department not found" });
            }
            res.status(200).json({ message: "Department retrieved successfully", data: department });
        }
        catch (error) {
            next(error);
        }
    };
    DepartmentController.createDepartmentHandler = async (req, res, next) => {
        try {
            const parsedData = CreateDepartmentSchema.parse(req.body);
            const department = await DepartmentService.createDepartment(parsedData);
            res
                .status(201)
                .json({ message: "Department created successfully", data: department });
        }
        catch (error) {
            next(error);
        }
    };
    DepartmentController.updateDepartmentHandler = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid department ID" });
            }
            const parsedData = UpdateDepartmentSchema.parse(req.body);
            const department = await DepartmentService.updateDepartment(id, parsedData);
            res
                .status(200)
                .json({ message: "Department updated successfully", data: department });
        }
        catch (error) {
            next(error);
        }
    };
    DepartmentController.deleteDepartmentHandler = async (req, res, next) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid department ID" });
            }
            const department = await DepartmentService.deleteDepartment(id);
            res
                .status(200)
                .json({ message: "Department deleted successfully", data: department });
        }
        catch (error) {
            next(error);
        }
    };
})(DepartmentController || (DepartmentController = {}));
