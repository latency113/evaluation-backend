import { courseAssignmentRepository } from "../../repositories/course-assignments/course-assignments.repository.js";
import { subjectRepository } from "../../repositories/subjects/subjects.repository.js";
import { teacherRepository } from "../../repositories/teachers/teachers.repository.js";
import { classroomRepository } from "../../repositories/classrooms/classrooms.repository.js";
import { departmentRepository } from "../../repositories/departments/departments.repository.js";
import { UpdateCourseAssignmentInput, CreateCourseAssignmentInput, courseAssignmentSchema } from "./course-assignments.schema.js";
import prisma from "@/providers/database/database.provider.js";
import ExcelJS from 'exceljs';

export namespace CourseAssignmentService {
    export const getAllAssignments = async (page: number = 1, limit: number = 10, searchTerm?: string) => {
        const [assignments, total] = await Promise.all([
            courseAssignmentRepository.getAllAssignments(page, limit, searchTerm),
            courseAssignmentRepository.countAssignments(searchTerm)
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

    export const importFromExcel = async (buffer: Buffer, overrideTerm?: string) => {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer as any);
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) throw new Error("No worksheet found");

        let importedCount = 0;
        let skippedCount = 0;
        let classroomNotFoundCount = 0;
        const missingRooms = new Set<string>();

        // --- 1. Global Detection (Classroom and Department) ---
        let globalRoomName = "";
        let departmentName = "";
        let globalTerm = overrideTerm || "";
        const roomRegex = /((ปวช|ปวส)\.?\s?\d+(\/\d+)?)|(\d+\/\d+(\s?(ปวช|ปวส))?)/i;

        // Search in sheet name first
        const sheetNameMatch = worksheet.name.match(roomRegex);
        if (sheetNameMatch) globalRoomName = sheetNameMatch[0];

        // Search in first 10 rows for room, department and term
        for (let i = 1; i <= 10; i++) {
            const row = worksheet.getRow(i);
            row.eachCell((cell, colNumber) => {
                const val = cell.value?.toString() || "";
                
                // Department detection (Keywords)
                if (val.includes("แผนกวิชา") || val.includes("แผนก") || val.includes("สาขาวิชา") || val.includes("สาขา")) {
                    const splitVal = val.split(/[:：]/)[1]?.trim();
                    const cleanVal = val.replace(/^(แผนกวิชา|แผนก|สาขาวิชา|สาขา)\s*[:：]?\s*/, "").trim();
                    const nextVal = row.getCell(colNumber + 1).value?.toString().trim();
                    if (!departmentName) {
                        departmentName = splitVal || cleanVal || nextVal || "";
                    }
                }

                // Room detection (Regex or Keywords)
                const roomMatch = val.match(roomRegex);
                if (roomMatch && !globalRoomName) {
                    globalRoomName = roomMatch[0];
                } else if (val.includes("ห้อง") || val.includes("ชั้นเรียน")) {
                     const splitVal = val.split(/[:：]/)[1]?.trim();
                     const cleanVal = val.replace(/^(ห้อง|ชั้นเรียน)\s*[:：]?\s*/, "").trim();
                     const nextVal = row.getCell(colNumber + 1).value?.toString().trim();
                     if (!globalRoomName) globalRoomName = splitVal || cleanVal || nextVal || "";
                }

                // Term detection (if not overridden)
                if (!globalTerm && (val.includes("ภาคเรียน") || val.includes("เทอม"))) {
                    const termMatch = val.match(/\d+\/\d+/);
                    if (termMatch) globalTerm = termMatch[0];
                }
            });
        }

        // --- 1.5 Fallback and Refinement ---
        // Fallback for department: Row 1 is usually Department
        if (!departmentName) {
            const row1Val = worksheet.getRow(1).getCell(1).value?.toString().trim();
            if (row1Val && !row1Val.includes("รหัส") && !row1Val.match(roomRegex)) {
                departmentName = row1Val;
            }
        }
        // Fallback for room: Row 2 is usually Room/Level
        if (!globalRoomName) {
            const row2Val = worksheet.getRow(2).getCell(1).value?.toString().trim();
            if (row2Val && !row2Val.includes("รหัส") && row2Val !== departmentName) {
                globalRoomName = row2Val;
            }
        }

        // Find or create department (MUST do this before processing rows)
        let departmentId: number | null = null;
        if (departmentName) {
            let dept = await departmentRepository.getDepartmentByName(departmentName);
            if (!dept) {
                dept = await departmentRepository.createDepartment({ dept_name: departmentName });
            }
            departmentId = dept.id;
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
                if (val.includes("ชื่อวิชา") || val.includes("ชื่อรายวิชา") || val.includes("วิชา")) { colMap.name = colNumber; foundHeader = true; }
                if (val.includes("สอน") || val.includes("ครู") || val.includes("อาจารย์") || val.includes("ผู้สอน")) { colMap.teacher = colNumber; foundHeader = true; }
                if (val.includes("ห้องเรียน") || val.includes("ชั้นเรียน") || (val.includes("กลุ่ม") && !val.includes("สาระ") && !val.includes("วิชา"))) { colMap.room = colNumber; foundHeader = true; }
                if (val.includes("เทอม") || val.includes("ภาคเรียน")) { colMap.term = colNumber; foundHeader = true; }
            });
            if (foundHeader && (colMap.code !== -1 || colMap.name !== -1)) {
                startRow = i + 1;
                break;
            }
        }

        // Ensure room and teacher aren't the same column if possible
        if (colMap.room !== -1 && colMap.room === colMap.teacher) {
            colMap.room = -1;
        }

        // Fallback to defaults only if headers were not found
        const headersFound = Object.values(colMap).some(v => v !== -1);
        if (!headersFound) {
            colMap.code = 1;
            colMap.name = 2;
            colMap.teacher = 3;
            colMap.room = 4;
        } else {
            // If some headers were found, only fallback essential missing ones
            if (colMap.code === -1) colMap.code = 1;
            if (colMap.name === -1) colMap.name = 2;
            if (colMap.teacher === -1) colMap.teacher = 3;
            // IMPORTANT: Only fallback room if not found AND no global room detected
            if (colMap.room === -1 && !globalRoomName) {
                colMap.room = 4;
            }
        }

        // Ensure room isn't overlapping teacher after fallback
        if (colMap.room === colMap.teacher) colMap.room = -1;

        // --- 3. Process Data ---
        const allTeachers = await teacherRepository.getAllTeachers(1, 1000);

        for (let i = startRow; i <= worksheet.rowCount; i++) {
            const row = worksheet.getRow(i);
            const subjectCode = row.getCell(colMap.code).value?.toString().trim();
            let subjectName = row.getCell(colMap.name).value?.toString().trim() || "";
            let teacherFullName = colMap.teacher !== -1 ? row.getCell(colMap.teacher).value?.toString().trim() : "";
            const rowRoomName = colMap.room !== -1 ? row.getCell(colMap.room).value?.toString().trim() : "";
            const rowTerm = colMap.term !== -1 ? row.getCell(colMap.term).value?.toString().trim() : "";

            // Skip empty rows or header clones
            if (!subjectCode || !subjectName || subjectCode.includes("รหัส") || subjectName.includes("ชื่อวิชา")) {
                continue;
            }

            // --- SPECIAL LOGIC: Handle teacher name stuck to subject name ---
            if (!teacherFullName || teacherFullName === "-" || teacherFullName === "") {
                for (const t of allTeachers) {
                    if (subjectName.endsWith(t.first_name)) {
                        teacherFullName = t.first_name;
                        // Strip teacher name from subject name
                        subjectName = subjectName.substring(0, subjectName.length - t.first_name.length).trim();
                        break;
                    }
                }
            }

            // A. Find/Create Subject
            let subject = await subjectRepository.getSubjectByCode(subjectCode);
            if (!subject) {
                subject = await subjectRepository.createSubject({
                    subject_code: subjectCode,
                    subject_name: subjectName
                });
            } else if (subject.subject_name !== subjectName) {
                // Optional: Update name if it was cleaned
                await subjectRepository.updateSubject(subject.id, { subject_name: subjectName });
            }

            // B. Find/Create Teacher
            let teacherId: number | null = null;
            if (teacherFullName && teacherFullName !== "-") {
                const cleanName = (name: string) => name.replace(/^(อ\.|ครู|อาจารย์|นาย|นาง|นางสาว)\s*/, '').trim();
                
                const nameParts = teacherFullName.replace(/^(อ\.|ครู|อาจารย์|นาย|นาง|นางสาว)\s*/, '').trim().split(/\s+/);
                const firstName = nameParts[0].trim();
                const lastName = nameParts.slice(1).join(' ').trim() || '-';
                
                // 1. Try to find in memory first (prefix-agnostic)
                let teacher = allTeachers.find(t => {
                    const dbFirstClean = cleanName(t.first_name);
                    const dbLastClean = cleanName(t.last_name);
                    const inputFirstClean = firstName; // already cleaned above
                    const inputLastClean = cleanName(lastName);
                    
                    return dbFirstClean === inputFirstClean && 
                           (inputLastClean === '-' || dbLastClean === '-' || dbLastClean === inputLastClean);
                });

                // 2. Fallback to DB search
                if (!teacher) {
                    teacher = await teacherRepository.getTeacherByName(firstName, lastName) ?? undefined;
                }

                if (!teacher) {
                    teacher = await teacherRepository.createTeacher({
                        first_name: firstName,
                        last_name: lastName
                    });
                    allTeachers.push(teacher);
                }
                teacherId = teacher.id;
            }

            // C. Find Classroom (Try row first, then global)
            const isLikelyTeacher = (val: string) => {
                if (!val) return false;
                if (/^(อ\.|ครู|อาจารย์|นาย|นาง|นางสาว)/.test(val)) return true;
                const clean = val.replace(/^(อ\.|ครู|อาจารย์|นาย|นาง|นางสาว)\s*/, '').trim();
                return allTeachers.some(t => {
                    const dbFirst = t.first_name.replace(/^(อ\.|ครู|อาจารย์|นาย|นาง|นางสาว)\s*/, '').trim();
                    return clean.includes(dbFirst);
                });
            };

            let targetRoomName = rowRoomName;
            
            // Safeguard: If targetRoomName is actually a teacher's name, it's a misdetection
            if (!targetRoomName || isLikelyTeacher(targetRoomName)) {
                targetRoomName = globalRoomName;
            }

            let classroomId: number | null = null;
            
            if (targetRoomName) {
                // Search strategy: 
                // 1. Try to find room that matches name AND departmentId
                let classroom = await prisma.classroom.findFirst({
                    where: {
                        OR: [
                            { room_name: targetRoomName },
                            { room_name: { contains: targetRoomName.replace(/(ปวช|ปวส|\.)/g, '').trim() } }
                        ],
                        dept_id: departmentId
                    }
                });

                // 2. Fallback to general search if not found within department
                if (!classroom) {
                    classroom = await classroomRepository.getClassroomByName(targetRoomName);
                    
                    if (!classroom) {
                        const veryCleanRoomName = targetRoomName.replace(/(ปวช|ปวส|\.)/g, '').trim();
                        if (veryCleanRoomName && veryCleanRoomName !== targetRoomName) {
                            classroom = await classroomRepository.getClassroomByName(veryCleanRoomName);
                        }
                    }
                }
                
                if (classroom) {
                    classroomId = classroom.id;
                    // Auto-link to department if missing or mismatched (if we're sure about the current department)
                    if (departmentId && classroom.dept_id !== departmentId) {
                        await classroomRepository.updateClassroom(classroom.id, { dept_id: departmentId } as any);
                    }
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
                const finalTerm = overrideTerm || rowTerm || globalTerm || "1/2567";
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
