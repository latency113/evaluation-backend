import { departmentRepository } from "../../repositories/departments/departments.repository.js";
import { UpdateDepartmentInput, CreateDepartmentInput, departmentSchema } from "./departments.schema.js";

export namespace DepartmentService {
    export const getAllDepartments = async (page: number = 1, limit: number = 10) => {
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
    }

    export const getAllDepartmentsWithoutPagination = async () => {
        const departments = await departmentRepository.getAllDepartmentsWithoutPagination();
        return departments.map(dept => departmentSchema.parse(dept));
    }

    export const getDepartmentById = async (id: number) => {
        const department = await departmentRepository.getDepartmentById(id);
        if (!department) return null;
        return departmentSchema.parse(department);
    }

    export const getDepartmentByName = async (name: string) => {
        const department = await departmentRepository.getDepartmentByName(name);
        if (!department) return null;
        return departmentSchema.parse(department);
    }

    export const createDepartment = async (data: CreateDepartmentInput) => {
        const newDepartment = await departmentRepository.createDepartment(data);
        return departmentSchema.parse(newDepartment);
    }

    export const updateDepartment = async (id: number, data: UpdateDepartmentInput) => {
        const updatedDepartment = await departmentRepository.updateDepartment(id, data);
        return departmentSchema.parse(updatedDepartment);
    }

    export const deleteDepartment = async (id: number) => {
        const deletedDepartment = await departmentRepository.deleteDepartment(id);
        return departmentSchema.parse(deletedDepartment);
    }
}
