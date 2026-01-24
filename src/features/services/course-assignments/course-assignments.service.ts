import { courseAssignmentRepository } from "../../repositories/course-assignments/course-assignments.repository.js";
import { subjectRepository } from "../../repositories/subjects/subjects.repository.js";
import { teacherRepository } from "../../repositories/teachers/teachers.repository.js";
import { classroomRepository } from "../../repositories/classrooms/classrooms.repository.js";
import { UpdateCourseAssignmentInput, CreateCourseAssignmentInput, courseAssignmentSchema } from "./course-assignments.schema.js";
import ExcelJS from 'exceljs';

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

    export const importFromExcel = async (buffer: Buffer) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer as any);
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) throw new Error("No worksheet found");

        let importedCount = 0;
        let skippedCount = 0;
        let classroomNotFoundCount = 0;
        const missingRooms = new Set<string>();

        // --- 1. Global Classroom Detection (Search in header or sheet name) ---
        let globalRoomName = "";
        // Search in sheet name first
        const sheetNameMatch = worksheet.name.match(/(ปวช|ปวส)\.?\s?\d+(\/\d+)?/);
        if (sheetNameMatch) globalRoomName = sheetNameMatch[0];

        // Search in first 10 rows
        for (let i = 1; i <= 10; i++) {
            const row = worksheet.getRow(i);
            row.eachCell(cell => {
                const val = cell.value?.toString() || "";
                const roomMatch = val.match(/(ปวช|ปวส)\.?\s?\d+(\/\d+)?/);
                if (roomMatch && !globalRoomName) {
                    globalRoomName = roomMatch[0];
                }
            });
        }

        // --- 2. Smart Column Detection ---
        let colMap = { code: -1, name: -1, teacher: -1, room: -1, term: -1 };
        let startRow = 1;

        for (let i = 1; i <= 10; i++) {
            const row = worksheet.getRow(i);
            let foundHeader = false;
            row.eachCell((cell, colNumber) => {
                const val = cell.value?.toString().toLowerCase() || "";
                if (val.includes("รหัส")) { colMap.code = colNumber; foundHeader = true; }
                if (val.includes("ชื่อวิชา") || val.includes("ชื่อรายวิชา")) { colMap.name = colNumber; foundHeader = true; }
                if (val.includes("สอน") || val.includes("ครู") || val.includes("อาจารย์")) { colMap.teacher = colNumber; foundHeader = true; }
                if (val.includes("ห้อง")) { colMap.room = colNumber; foundHeader = true; }
                if (val.includes("เทอม") || val.includes("ภาคเรียน")) { colMap.term = colNumber; foundHeader = true; }
            });
            if (foundHeader && colMap.code !== -1) {
                startRow = i + 1;
                break;
            }
        }

        // Fallback to defaults
        if (colMap.code === -1) colMap.code = 1;
        if (colMap.name === -1) colMap.name = 2;
        if (colMap.teacher === -1) colMap.teacher = 3;
        if (colMap.room === -1) colMap.room = 4;

        // --- 3. Process Data ---
        for (let i = startRow; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const subjectCode = row.getCell(colMap.code).value?.toString().trim();
            const subjectName = row.getCell(colMap.name).value?.toString().trim();
            const teacherFullName = row.getCell(colMap.teacher).value?.toString().trim();
            const rowRoomName = colMap.room !== -1 ? row.getCell(colMap.room).value?.toString().trim() : "";
            const term = colMap.term !== -1 ? row.getCell(colMap.term).value?.toString().trim() : "1/2567";

            // Skip empty rows or header clones
            if (!subjectCode || !subjectName || subjectCode.includes("รหัส") || subjectName.includes("ชื่อวิชา")) {
                continue;
            }

            // A. Find/Create Subject
            let subject = await subjectRepository.getSubjectByCode(subjectCode);
            if (!subject) {
                subject = await subjectRepository.createSubject({
                    subject_code: subjectCode,
                    subject_name: subjectName
                });
            }

            // B. Find/Create Teacher
            let teacherId: number | null = null;
            if (teacherFullName && teacherFullName !== "-") {
                const nameParts = teacherFullName.replace(/^(อ\.|ครู|อาจารย์|นาย|นาง|นางสาว)\s*/, '').split(/\s+/);
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(' ') || '';
                
                let teacher = await teacherRepository.getTeacherByName(firstName, lastName);
                if (!teacher) {
                    teacher = await teacherRepository.createTeacher({
                        first_name: firstName,
                        last_name: lastName
                    });
                }
                teacherId = teacher.id;
            }

            // C. Find Classroom (Try row first, then global)
            const targetRoomName = rowRoomName || globalRoomName;
            let classroomId: number | null = null;
            
            if (targetRoomName) {
                // Search strategy: exact match, then clean match
                let classroom = await classroomRepository.getClassroomByName(targetRoomName);
                if (!classroom) {
                    const cleanRoomName = targetRoomName.replace(/^(ปวช\.|ปวส\.|ปวช|ปวส)\s*/, '').trim();
                    classroom = await classroomRepository.getClassroomByName(cleanRoomName);
                }
                
                if (classroom) {
                    classroomId = classroom.id;
                } else {
                    classroomNotFoundCount++;
                    missingRooms.add(targetRoomName);
                    continue;
                }
            } else {
                classroomNotFoundCount++;
                missingRooms.add("ไม่ระบุห้องเรียน");
                continue;
            }

            // D. Create Assignment
            if (subject && teacherId && classroomId) {
                const finalTerm = term || "1/2567";
                const existing = await courseAssignmentRepository.findExisting(
                    subject.id,
                    teacherId,
                    classroomId,
                    finalTerm
                );

                if (!existing) {
                    await courseAssignmentRepository.createAssignment({
                        subject_id: subject.id,
                        teacher_id: teacherId,
                        classroom_id: classroomId,
                        term: finalTerm
                    });
                    importedCount++;
                } else {
                    skippedCount++;
                }
            }
        }

        return { 
            total: importedCount + skippedCount + classroomNotFoundCount, 
            imported: importedCount, 
            skipped: skippedCount,
            classroomNotFound: classroomNotFoundCount,
            missingRooms: Array.from(missingRooms)
        };
    }
}
