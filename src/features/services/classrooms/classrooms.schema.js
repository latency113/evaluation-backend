import z from "zod";
export const classroomSchema = z.object({
    id: z.number(),
    room_name: z.string(),
    level_id: z.number().nullable().optional(),
    level: z.object({
        id: z.number(),
        level_name: z.string(),
        dept_id: z.number().nullable().optional(),
        department: z.object({
            id: z.number(),
            dept_name: z.string(),
        }).nullable().optional(),
    }).nullable().optional(),
});
export const CreateClassroomSchema = classroomSchema.omit({ id: true, level: true });
export const UpdateClassroomSchema = classroomSchema.partial();
