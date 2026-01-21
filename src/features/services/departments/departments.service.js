import { departmentRepository } from "../../repositories/departments/departments.repository";
import { departmentSchema } from "./departments.schema";
export var DepartmentService;
(function (DepartmentService) {
    DepartmentService.getAllDepartments = async (page = 1, limit = 10) => {
        const [departments, total] = await Promise.all([
            departmentRepository.getAllDepartments(page, limit),
            departmentRepository.countDepartments()
        ]);
        return {
            departments: departments.map(dept => departmentSchema.parse(dept)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    };
    DepartmentService.getDepartmentById = async (id) => {
        const department = await departmentRepository.getDepartmentById(id);
        if (!department)
            return null;
        return departmentSchema.parse(department);
    };
    DepartmentService.createDepartment = async (data) => {
        const newDepartment = await departmentRepository.createDepartment(data);
        return departmentSchema.parse(newDepartment);
    };
    DepartmentService.updateDepartment = async (id, data) => {
        const updatedDepartment = await departmentRepository.updateDepartment(id, data);
        return departmentSchema.parse(updatedDepartment);
    };
    DepartmentService.deleteDepartment = async (id) => {
        const deletedDepartment = await departmentRepository.deleteDepartment(id);
        return departmentSchema.parse(deletedDepartment);
    };
})(DepartmentService || (DepartmentService = {}));
