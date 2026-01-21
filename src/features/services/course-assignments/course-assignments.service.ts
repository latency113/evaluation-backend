import { courseAssignmentRepository } from "../../repositories/course-assignments/course-assignments.repository";
import { UpdateCourseAssignmentInput, CreateCourseAssignmentInput, courseAssignmentSchema } from "./course-assignments.schema";

export namespace CourseAssignmentService {
    export const getAllAssignments = async (page: number = 1, limit: number = 10) => {
        const [assignments, total] = await Promise.all([
            courseAssignmentRepository.getAllAssignments(page, limit),
            courseAssignmentRepository.countAssignments()
        ]);

        return {
            assignments: assignments.map(assignment => courseAssignmentSchema.parse(assignment)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    export const getAssignmentById = async (id: number) => {
        const assignment = await courseAssignmentRepository.getAssignmentById(id);
        if (!assignment) return null;
        return courseAssignmentSchema.parse(assignment);
    }

    export const createAssignment = async (data: CreateCourseAssignmentInput) => {
        const newAssignment = await courseAssignmentRepository.createAssignment(data);
        return courseAssignmentSchema.parse(newAssignment);
    }

    export const updateAssignment = async (id: number, data: UpdateCourseAssignmentInput) => {
        const updatedAssignment = await courseAssignmentRepository.updateAssignment(id, data);
        return courseAssignmentSchema.parse(updatedAssignment);
    }

    export const deleteAssignment = async (id: number) => {
        const deletedAssignment = await courseAssignmentRepository.deleteAssignment(id);
        return courseAssignmentSchema.parse(deletedAssignment);
    }
}
