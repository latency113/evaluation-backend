import { courseAssignmentRepository } from "../../repositories/course-assignments/course-assignments.repository";
import { courseAssignmentSchema } from "./course-assignments.schema";
export var CourseAssignmentService;
(function (CourseAssignmentService) {
    CourseAssignmentService.getAllAssignments = async (page = 1, limit = 10) => {
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
    };
    CourseAssignmentService.getAssignmentById = async (id) => {
        const assignment = await courseAssignmentRepository.getAssignmentById(id);
        if (!assignment)
            return null;
        return courseAssignmentSchema.parse(assignment);
    };
    CourseAssignmentService.createAssignment = async (data) => {
        const newAssignment = await courseAssignmentRepository.createAssignment(data);
        return courseAssignmentSchema.parse(newAssignment);
    };
    CourseAssignmentService.updateAssignment = async (id, data) => {
        const updatedAssignment = await courseAssignmentRepository.updateAssignment(id, data);
        return courseAssignmentSchema.parse(updatedAssignment);
    };
    CourseAssignmentService.deleteAssignment = async (id) => {
        const deletedAssignment = await courseAssignmentRepository.deleteAssignment(id);
        return courseAssignmentSchema.parse(deletedAssignment);
    };
})(CourseAssignmentService || (CourseAssignmentService = {}));
