import { classroomRepository } from "../../repositories/classrooms/classrooms.repository.js";
import { UpdateClassroomInput, CreateClassroomInput, classroomSchema } from "./classrooms.schema.js";
import ExcelJS from 'exceljs';

export namespace ClassroomService {
    export const getAllClassrooms = async (page: number = 1, limit: number = 10) => {
        const [classrooms, total] = await Promise.all([
            classroomRepository.getAllClassrooms(page, limit),
            classroomRepository.countClassrooms()
        ]);

        return {
            classrooms: classrooms.map(classroom => classroomSchema.parse(classroom)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    export const getClassroomById = async (id: number) => {
        const classroom = await classroomRepository.getClassroomById(id);
        if (!classroom) return null;
        return classroomSchema.parse(classroom);
    }

    export const createClassroom = async (data: CreateClassroomInput) => {
        const newClassroom = await classroomRepository.createClassroom(data);
        return classroomSchema.parse(newClassroom);
    }

    export const updateClassroom = async (id: number, data: UpdateClassroomInput) => {
        const updatedClassroom = await classroomRepository.updateClassroom(id, data);
        return classroomSchema.parse(updatedClassroom);
    }

    export const deleteClassroom = async (id: number) => {
        const deletedClassroom = await classroomRepository.deleteClassroom(id);
        return classroomSchema.parse(deletedClassroom);
    }

    export const importFromExcel = async (buffer: Buffer) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer as any);
        const results = [];

        for (const worksheet of workbook.worksheets) {
            // 1. อ่านชื่อแผนกวิชา (F7)
            const deptValue = worksheet.getCell('F7').value?.toString().trim();
            if (!deptValue) continue;

            const departmentName = deptValue
                .replace(/^(ชื่อกลุ่มเรียน|รหัสกลุ่มเรียน|กลุ่มเรียน)/g, '')
                .replace(/\s+\d+$/, '') // ลบเลขท้าย (ถ้ามี)
                .trim();

            // 2. อ่านชื่อครูที่ปรึกษา (F8)
            const teacherValue = worksheet.getCell('F8').value?.toString().trim();
            const teacherName = teacherValue ? teacherValue.replace(/^(ครูที่ปรึกษา|อาจารย์ที่ปรึกษา)/g, '').trim() : "ไม่ระบุ";

            // 3. อ่านระดับชั้นและห้อง (C8) เช่น "ปวช.1/1"
            const gradeValue = worksheet.getCell('C8').value?.toString().trim() || '';
            const levelName = gradeValue.includes('.') ? gradeValue.split('/')[0] : (gradeValue || 'ทั่วไป');
            const roomName = gradeValue.replace(/^(ปวช\.|ปวส\.|ปวช|ปวส)/g, '').trim() || worksheet.name;

            // 4. อ่านข้อมูลนักเรียน (เริ่มแถว 11)
            const students: any[] = [];
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber >= 11) {
                    const studentCode = row.getCell(3).value?.toString().trim(); // Column C
                    const fullName = row.getCell(4).value?.toString().trim();    // Column D
                    if (studentCode && fullName && studentCode.length > 5) {
                        const parts = fullName.split(/\s+/);
                        students.push({
                            studentCode,
                            firstName: parts[0],
                            lastName: parts.slice(1).join(' ') || ''
                        });
                    }
                }
            });

            if (students.length > 0) {
                const created = await classroomRepository.createWithDependencies({
                    roomName,
                    departmentName,
                    levelName,
                    teacherName,
                    students
                });
                results.push(created);
            }
        }
        return results;
    }
}
