import { teacherRepository } from "@/features/repositories/teachers/teachers.repository.js";
import { subjectRepository } from "../../repositories/subjects/subjects.repository.js";
import {
  UpdateSubjectInput,
  CreateSubjectInput,
  subjectSchema,
} from "./subjects.schema.js";
import ExcelJS from "exceljs";

export namespace SubjectService {
  export const getAllSubjects = async (
    page: number = 1,
    limit: number = 10,
    searchTerm?: string,
  ) => {
    const [subjects, total] = await Promise.all([
      subjectRepository.getAllSubjects(page, limit, searchTerm),
      subjectRepository.countSubjects(searchTerm),
    ]);

    return {
      subjects: subjects.map((subject) => subjectSchema.parse(subject)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  };

  export const getSubjectById = async (id: number) => {
    const subject = await subjectRepository.getSubjectById(id);
    if (!subject) return null;
    return subjectSchema.parse(subject);
  };

  export const createSubject = async (data: CreateSubjectInput) => {
    const newSubject = await subjectRepository.createSubject(data);
    return subjectSchema.parse(newSubject);
  };

  export const updateSubject = async (id: number, data: UpdateSubjectInput) => {
    const updatedSubject = await subjectRepository.updateSubject(id, data);
    return subjectSchema.parse(updatedSubject);
  };

  export const deleteSubject = async (id: number) => {
    const deletedSubject = await subjectRepository.deleteSubject(id);
    return subjectSchema.parse(deletedSubject);
  };

  export const importFromExcel = async (buffer: Buffer) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) throw new Error("No worksheet found");

    // 1. ดึงข้อมูลส่วนหัว (แผนก และ ระดับชั้น)
    const departmentName = worksheet
      .getRow(1)
      .getCell(1)
      .value?.toString()
      .trim();
    const levelName = worksheet.getRow(2).getCell(1).value?.toString().trim();

    const subjects: any[] = [];
    let importedCount = 0;

    // 2. วนลูปดึงข้อมูลรายวิชาและชื่อครู
    // ใช้ for...of แทน eachRow เพื่อให้สามารถใช้ await ภายในลูปได้ง่ายขึ้น
    for (let i = 4; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const code = row.getCell(1).value?.toString().trim(); // Column A
      const name = row.getCell(4).value?.toString().trim(); // Column D
      const teacherName = row.getCell(6).value?.toString().trim(); // Column F: ชื่อครู

      if (code && name) {
        let teacherId = null;

        // ค้นหา Teacher จากชื่อใน Database
        if (teacherName) {
          const teacher = await teacherRepository.getTeacherByName(teacherName);
          if (teacher) {
            teacherId = teacher.id; // เก็บ ID ของครูไว้
          } else {
            console.warn(`ไม่พบข้อมูลครูชื่อ: ${teacherName} ในระบบ`);
            // คุณอาจจะเลือกข้าม หรือสร้างครูใหม่ที่นี่ก็ได้
          }
        }

        subjects.push({
          subject_code: code,
          subject_name: name,
          department: departmentName,
          level: levelName,
          teacher_id: teacherId, // เชื่อมโยง ID ครู
        });
      }
    }

    // 3. บันทึกลงฐานข้อมูล
    for (const item of subjects) {
      // เช็คว่ามีวิชานี้คู่กับครูคนนี้ในระดับชั้นนี้อยู่แล้วหรือยัง (ป้องกันข้อมูลซ้ำ)
      const exists = await subjectRepository.checkDuplicate(
        item.subject_code,
        item.teacher_id,
        item.level,
      );

      if (!exists) {
        await subjectRepository.createSubject(item);
        importedCount++;
      }
    }

    return { total: subjects.length, imported: importedCount };
  };
}
