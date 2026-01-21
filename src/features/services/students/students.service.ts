import { studentRepository } from "../../repositories/students/students.repository";
import { UpdateStudentInput, CreateStudentInput, studentSchema } from "./students.schema";

export namespace StudentService {
    export const getAllStudents = async (page: number = 1, limit: number = 10, search: string = "", classroomId?: number) => {
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
    }

    export const getStudentById = async (id: number) => {
        const student = await studentRepository.getStudentById(id);
        if (!student) return null;
        return studentSchema.parse(student);
    }

    export const createStudent = async (data: CreateStudentInput) => {
        const newStudent = await studentRepository.createStudent(data);
        return studentSchema.parse(newStudent);
    }

    export const updateStudent = async (id: number, data: UpdateStudentInput) => {
        const updatedStudent = await studentRepository.updateStudent(id, data);
        return studentSchema.parse(updatedStudent);
    }

    export const deleteStudent = async (id: number) => {
        const deletedStudent = await studentRepository.deleteStudent(id);
        return studentSchema.parse(deletedStudent);
    }
}
