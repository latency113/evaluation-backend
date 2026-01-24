import { teacherRepository } from "../../repositories/teachers/teachers.repository.js";
import { UpdateTeacherInput, CreateTeacherInput, teacherSchema } from "./teachers.schema.js";
import ExcelJS from 'exceljs';

export namespace TeacherService {
    export const getAllTeachers = async (page: number = 1, limit: number = 10) => {
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
    }

    export const getTeacherById = async (id: number) => {
        const teacher = await teacherRepository.getTeacherById(id);
        if (!teacher) return null;
        return teacherSchema.parse(teacher);
    }

    export const createTeacher = async (data: CreateTeacherInput) => {
        const newTeacher = await teacherRepository.createTeacher(data);
        return teacherSchema.parse(newTeacher);
    }

    export const updateTeacher = async (id: number, data: UpdateTeacherInput) => {
        const updatedTeacher = await teacherRepository.updateTeacher(id, data);
        return teacherSchema.parse(updatedTeacher);
    }

    export const deleteTeacher = async (id: number) => {
        const deletedTeacher = await teacherRepository.deleteTeacher(id);
        return teacherSchema.parse(deletedTeacher);
    }

    export const importFromExcel = async (buffer: Buffer) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer as any);
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) throw new Error("No worksheet found");

        const teachers: any[] = [];
        let importedCount = 0;

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header
                const firstName = row.getCell(1).value?.toString().trim();
                const lastName = row.getCell(2).value?.toString().trim();

                if (firstName && lastName) {
                    teachers.push({
                        first_name: firstName,
                        last_name: lastName
                    });
                }
            }
        });

        for (const item of teachers) {
            const exists = await teacherRepository.getTeacherByName(item.first_name, item.last_name);
            if (!exists) {
                await teacherRepository.createTeacher(item);
                importedCount++;
            }
        }

        return { total: teachers.length, imported: importedCount };
    }
}
