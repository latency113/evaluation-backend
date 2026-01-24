import { z } from "zod";

export const courseAssignmentSchema = z.object({
    id: z.number(),
    teacher_id: z.number().nullable().optional(),
    subject_id: z.number().nullable().optional(),
    classroom_id: z.number().nullable().optional(),
    term: z.string(),
    teacher: z.object({
        id: z.number(),
        first_name: z.string(),
        last_name: z.string(),
    }).nullable().optional(),
    subject: z.object({
        id: z.number(),
        subject_code: z.string(),
        subject_name: z.string(),
    }).nullable().optional(),
    classroom: z.object({
        id: z.number(),
        room_name: z.string(),
        level: z.object({
            id: z.number(),
            level_name: z.string(),
        }).nullable().optional(),
        department: z.object({
            id: z.number(),
            dept_name: z.string(),
        }).nullable().optional(),
    }).nullable().optional(),
});

export const CreateCourseAssignmentSchema = courseAssignmentSchema.omit({ 
    id: true, 
    teacher: true, 
    subject: true, 
    classroom: true 
});
export const UpdateCourseAssignmentSchema = CreateCourseAssignmentSchema.partial();

export type CreateCourseAssignmentInput = z.infer<typeof CreateCourseAssignmentSchema>;
export type UpdateCourseAssignmentInput = z.infer<typeof UpdateCourseAssignmentSchema>;
export type CourseAssignment = z.infer<typeof courseAssignmentSchema>;
