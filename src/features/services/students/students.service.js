import { studentRepository } from "../../repositories/students/students.repository";
import { studentSchema } from "./students.schema";
export var StudentService;
(function (StudentService) {
    StudentService.getAllStudents = async (page = 1, limit = 10, search = "", classroomId) => {
        const [students, total] = await Promise.all([
            studentRepository.getAllStudents(page, limit, search, classroomId),
            studentRepository.countStudents(search, classroomId)
        ]);
        return {
            students: students.map(student => studentSchema.parse(student)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    };
    StudentService.getStudentById = async (id) => {
        const student = await studentRepository.getStudentById(id);
        if (!student)
            return null;
        return studentSchema.parse(student);
    };
    StudentService.createStudent = async (data) => {
        const newStudent = await studentRepository.createStudent(data);
        return studentSchema.parse(newStudent);
    };
    StudentService.updateStudent = async (id, data) => {
        const updatedStudent = await studentRepository.updateStudent(id, data);
        return studentSchema.parse(updatedStudent);
    };
    StudentService.deleteStudent = async (id) => {
        const deletedStudent = await studentRepository.deleteStudent(id);
        return studentSchema.parse(deletedStudent);
    };
})(StudentService || (StudentService = {}));
