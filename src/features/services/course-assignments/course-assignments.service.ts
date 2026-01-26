import { courseAssignmentRepository } from "../../repositories/course-assignments/course-assignments.repository.js";
import { subjectRepository } from "../../repositories/subjects/subjects.repository.js";
import { teacherRepository } from "../../repositories/teachers/teachers.repository.js";
import { classroomRepository } from "../../repositories/classrooms/classrooms.repository.js";
import { departmentRepository } from "../../repositories/departments/departments.repository.js";
import { UpdateCourseAssignmentInput, CreateCourseAssignmentInput, courseAssignmentSchema } from "./course-assignments.schema.js";
import prisma from "@/providers/database/database.provider.js";
import ExcelJS from 'exceljs';

export namespace CourseAssignmentService {
    export const getAllAssignments = async (page: number = 1, limit: number = 10, searchTerm?: string, deptId?: number, classroomId?: number) => {
        const [assignments, total] = await Promise.all([
            courseAssignmentRepository.getAllAssignments(page, limit, searchTerm, deptId, classroomId),
            courseAssignmentRepository.countAssignments(searchTerm, deptId, classroomId)
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

        let totalImportedCount = 0;
        let totalSkippedCount = 0;
        let totalClassroomNotFoundCount = 0;
        const missingRooms = new Set<string>();

        const allTeachers = await teacherRepository.getAllTeachers(1, 1000);

        for (const worksheet of workbook.worksheets) {
            // --- 1. Global Detection per Sheet (Classroom and Department) ---
            let globalRoomName = "";
            let departmentName = "";
            let globalTerm = overrideTerm || "";
            const roomRegex = /((ปวช|ปวส)\.?\s?\d+(\/\d+)?(\.\d+)?)|(\d+\/\d+(\s?(ปวช|ปวส)(\.\d+)?)?)/i;

            // Search in sheet name first
            const sheetNameMatch = worksheet.name.match(roomRegex);
            if (sheetNameMatch) globalRoomName = sheetNameMatch[0];

            // Search in first 10 rows for room, department and term
            for (let i = 1; i <= 10; i++) {
                const row = worksheet.getRow(i);
                row.eachCell((cell, colNumber) => {
                    const val = cell.value?.toString() || "";
                    
                    if (val.includes("แผนกวิชา") || val.includes("แผนก") || val.includes("สาขาวิชา") || val.includes("สาขา")) {
                        const splitVal = val.split(/[:：]/)[1]?.trim();
                        const cleanVal = val.replace(/^(แผนกวิชา|แผนก|สาขาวิชา|สาขา)\s*[:：]?\s*/, "").trim();
                        const nextVal = row.getCell(colNumber + 1).value?.toString().trim();
                        if (!departmentName) departmentName = splitVal || cleanVal || nextVal || "";
                    }

                    const roomMatch = val.match(roomRegex);
                    if (roomMatch && !globalRoomName) {
                        globalRoomName = roomMatch[0];
                    } else if (val.includes("ห้อง") || val.includes("ชั้นเรียน")) {
                         const splitVal = val.split(/[:：]/)[1]?.trim();
                         const cleanVal = val.replace(/^(ห้อง|ชั้นเรียน)\s*[:：]?\s*/, "").trim();
                         const nextVal = row.getCell(colNumber + 1).value?.toString().trim();
                         if (!globalRoomName) globalRoomName = splitVal || cleanVal || nextVal || "";
                    }

                    if (!globalTerm && (val.includes("ภาคเรียน") || val.includes("เทอม"))) {
                        const termMatch = val.match(/\d+\/\d+/);
                        if (termMatch) globalTerm = termMatch[0];
                    }
                });
            }

            // Fallbacks
            if (!departmentName) {
                const row1Val = worksheet.getRow(1).getCell(1).value?.toString().trim();
                if (row1Val && !row1Val.includes("รหัส") && !row1Val.match(roomRegex)) departmentName = row1Val;
            }
            if (!globalRoomName) {
                const row2Val = worksheet.getRow(2).getCell(1).value?.toString().trim();
                if (row2Val && !row2Val.includes("รหัส") && row2Val !== departmentName) globalRoomName = row2Val;
            }

            let departmentId: number | null = null;
            if (departmentName) {
                let dept = await departmentRepository.getDepartmentByName(departmentName);
                if (!dept) dept = await departmentRepository.createDepartment({ dept_name: departmentName });
                departmentId = dept.id;
            }

            // --- 2. Smart Column Detection per Sheet ---
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

            const headersFound = Object.values(colMap).some(v => v !== -1);
            if (!headersFound) {
                colMap.code = 1; colMap.name = 2; colMap.teacher = 3; colMap.room = 4;
            } else {
                if (colMap.code === -1) colMap.code = 1;
                if (colMap.name === -1) colMap.name = 2;
                if (colMap.teacher === -1) colMap.teacher = 3;
                if (colMap.room === -1 && !globalRoomName) colMap.room = 4;
            }
            if (colMap.room !== -1 && colMap.room === colMap.teacher) colMap.room = -1;

            // --- 3. Process Data for this Sheet ---
            for (let i = startRow; i <= worksheet.rowCount; i++) {
                const row = worksheet.getRow(i);
                const subjectCode = row.getCell(colMap.code).value?.toString().trim();
                let subjectName = row.getCell(colMap.name).value?.toString().trim() || "";
                let teacherFullName = colMap.teacher !== -1 ? row.getCell(colMap.teacher).value?.toString().trim() : "";
                const rowRoomName = colMap.room !== -1 ? row.getCell(colMap.room).value?.toString().trim() : "";
                const rowTerm = colMap.term !== -1 ? row.getCell(colMap.term).value?.toString().trim() : "";

                if (!subjectCode || !subjectName || subjectCode.includes("รหัส") || subjectName.includes("ชื่อวิชา")) continue;

                if (!teacherFullName || teacherFullName === "-" || teacherFullName === "") {
                    for (const t of allTeachers) {
                        if (subjectName.endsWith(t.first_name)) {
                            teacherFullName = t.first_name;
                            subjectName = subjectName.substring(0, subjectName.length - t.first_name.length).trim();
                            break;
                        }
                    }
                }

                let subject = await subjectRepository.getSubjectByCode(subjectCode);
                if (!subject) {
                    subject = await subjectRepository.createSubject({ subject_code: subjectCode, subject_name: subjectName });
                }

                let teacherId: number | null = null;
                if (teacherFullName && teacherFullName !== "-") {
                    const cleanName = (name: string) => name.replace(/^(อ\.|ครู|อาจารย์|นาย|นาง|นางสาว)\s*/, '').trim();
                    const nameParts = teacherFullName.replace(/^(อ\.|ครู|อาจารย์|นาย|นาง|นางสาว)\s*/, '').trim().split(/\s+/);
                    const firstName = nameParts[0].trim();
                    const lastName = nameParts.slice(1).join(' ').trim() || '-';
                    
                    let teacher = allTeachers.find(t => {
                        return cleanName(t.first_name) === firstName && 
                               (lastName === '-' || cleanName(t.last_name) === '-' || cleanName(t.last_name) === cleanName(lastName));
                    });

                    if (!teacher) teacher = await teacherRepository.getTeacherByName(firstName, lastName) ?? undefined;
                    if (!teacher) {
                        teacher = await teacherRepository.createTeacher({ first_name: firstName, last_name: lastName });
                        allTeachers.push(teacher);
                    }
                    teacherId = teacher.id;
                }

                const isLikelyTeacher = (val: string) => {
                    if (!val || /^(อ\.|ครู|อาจารย์|นาย|นาง|นางสาว)/.test(val)) return true;
                    return allTeachers.some(t => val.includes(t.first_name.replace(/^(อ\.|ครู|อาจารย์|นาย|นาง|นางสาว)\s*/, '').trim()));
                };

                let targetRoomName = rowRoomName;
                if (!targetRoomName || isLikelyTeacher(targetRoomName)) targetRoomName = globalRoomName;

                let classroomId: number | null = null;
                if (targetRoomName) {
                    const isPWS = /ปวส/i.test(targetRoomName);
                    const isPWC = /ปวช/i.test(targetRoomName);
                    const roomNumberMatch = targetRoomName.match(/\d+\/\d+/);
                    const roomNumber = roomNumberMatch ? roomNumberMatch[0] : null;

                    let classroom = await prisma.classroom.findFirst({
                        where: {
                            dept_id: departmentId,
                            OR: [
                                { room_name: targetRoomName },
                                {
                                    AND: [
                                        roomNumber ? { room_name: { contains: roomNumber } } : {},
                                        isPWS ? { 
                                            OR: [
                                                { room_name: { contains: "ปวส" } },
                                                { level: { level_name: { contains: "ปวส" } } }
                                            ]
                                        } : {},
                                        isPWC ? { 
                                            OR: [
                                                { room_name: { contains: "ปวช" } },
                                                { level: { level_name: { contains: "ปวช" } } }
                                            ]
                                        } : {}
                                    ].filter(cond => Object.keys(cond).length > 0)
                                }
                            ]
                        }
                    });

                    if (!classroom) {
                        classroom = await classroomRepository.getClassroomByName(targetRoomName);
                        if (!classroom) {
                            const veryClean = targetRoomName.replace(/(ปวช|ปวส|\.)/g, '').trim();
                            if (veryClean && veryClean !== targetRoomName) classroom = await classroomRepository.getClassroomByName(veryClean);
                        }
                    }
                    
                    if (classroom) {
                        classroomId = classroom.id;
                        if (departmentId && classroom.dept_id !== departmentId) {
                            await classroomRepository.updateClassroom(classroom.id, { dept_id: departmentId } as any);
                        }
                    } else {
                        totalClassroomNotFoundCount++;
                        missingRooms.add(targetRoomName);
                        continue;
                    }
                } else {
                    totalClassroomNotFoundCount++;
                    missingRooms.add("ไม่ระบุห้องเรียน");
                    continue;
                }

                if (subject && teacherId && classroomId) {
                    const finalTerm = overrideTerm || rowTerm || globalTerm || "1/2567";
                    const existing = await courseAssignmentRepository.findExisting(subject.id, teacherId, classroomId, finalTerm);
                    if (!existing) {
                        await courseAssignmentRepository.createAssignment({ subject_id: subject.id, teacher_id: teacherId, classroom_id: classroomId, term: finalTerm });
                        totalImportedCount++;
                    } else {
                        totalSkippedCount++;
                    }
                }
            }
        }

        return { 
            total: totalImportedCount + totalSkippedCount + totalClassroomNotFoundCount, 
            imported: totalImportedCount, 
            skipped: totalSkippedCount,
            classroomNotFound: totalClassroomNotFoundCount,
            missingRooms: Array.from(missingRooms)
        };
    }
}

