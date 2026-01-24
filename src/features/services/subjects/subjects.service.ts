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

    // 1. ดึงข้อมูลส่วนหัว (แผนก และ ระดับชั้น) โดยการค้นหา Keyword
    let departmentName = "";
    let levelName = "";

    // ค้นหาใน 10 แถวแรก
    for (let i = 1; i <= 10; i++) {
      const row = worksheet.getRow(i);
      row.eachCell((cell, colNumber) => {
        const val = cell.value?.toString() || "";
        
        // Check for Department / Branch
        if (val.includes("แผนกวิชา") || val.includes("แผนก") || val.includes("สาขาวิชา") || val.includes("สาขา")) {
          const splitVal = val.split(/[:：]/)[1]?.trim();
          const cleanVal = val.replace(/^(แผนกวิชา|แผนก|สาขาวิชา|สาขา)\s*[:：]?\s*/, "").trim();
          const nextVal = row.getCell(colNumber + 1).value?.toString().trim();
          
          if (!departmentName) {
            departmentName = splitVal || cleanVal || nextVal || "";
          }
        }
        
        // Check for Level
        if (val.includes("ระดับชั้น") || val.includes("ชั้นปี") || val.includes("ห้อง")) {
          const splitVal = val.split(/[:：]/)[1]?.trim();
          const cleanVal = val.replace(/^(ระดับชั้น|ชั้นปี|ห้อง)\s*[:：]?\s*/, "").trim();
          const nextVal = row.getCell(colNumber + 1).value?.toString().trim();
          
          if (!levelName) {
            levelName = splitVal || cleanVal || nextVal || "";
          }
        }
      });
      if (departmentName && levelName) break;
    }

    // Fallback if not found by keyword: Row 1 is usually Department, Row 2 is Level/Room
    if (!departmentName) {
      const row1Val = worksheet.getRow(1).getCell(1).value?.toString().trim();
      if (row1Val && !row1Val.includes("รหัส")) departmentName = row1Val;
    }
    if (!levelName) {
      const row2Val = worksheet.getRow(2).getCell(1).value?.toString().trim();
      if (row2Val && !row2Val.includes("รหัส")) levelName = row2Val;
    }

    const subjects: any[] = [];
    let importedCount = 0;

    // 2. ค้นหาแถวเริ่มต้น (ที่มีคำว่า "รหัส")
    let startRow = 1;
    for (let i = 1; i <= 10; i++) {
        const row = worksheet.getRow(i);
        const rowVal = row.values.toString();
        if (rowVal.includes("รหัส") || rowVal.includes("วิชา")) {
            startRow = i + 1;
            break;
        }
    }

    // 3. วนลูปดึงข้อมูลรายวิชาและชื่อครู
    for (let i = startRow; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      const code = row.getCell(1).value?.toString().trim(); // Column A
      const name = row.getCell(4).value?.toString().trim(); // Column D
      const teacherName = row.getCell(6).value?.toString().trim(); // Column F: ชื่อครู

      if (code && name && code !== "รหัส") {
        let teacherId = null;

        // ค้นหา Teacher จากชื่อใน Database
        if (teacherName && teacherName !== "-") {
          const parts = teacherName.replace(/^(อ\.|ครู|อาจารย์|นาย|นาง|นางสาว)\s*/, '').trim().split(/\s+/);
          const firstName = parts[0];
          const lastName = parts.slice(1).join(' ') || '-';
          const teacher = await teacherRepository.getTeacherByName(firstName, lastName);
          if (teacher) {
            teacherId = teacher.id;
          }
        }

        subjects.push({
          subject_code: code,
          subject_name: name,
          teacher_id: teacherId,
        });
      }
    }

    // 4. บันทึกลงฐานข้อมูล
    for (const item of subjects) {
      const exists = await subjectRepository.checkDuplicate(item.subject_code);

      if (!exists) {
        await subjectRepository.createSubject(item);
        importedCount++;
      }
    }

    return { 
        total: subjects.length, 
        imported: importedCount, 
        department: departmentName, 
        level: levelName 
    };
  };
}
