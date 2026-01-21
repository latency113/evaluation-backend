import z from "zod";

export const userSchema = z.object({
    id: z.number(),
    username: z.string(),
    password: z.string(),
    role: z.enum(["admin", "teacher"]).default("teacher"),
    ref_id: z.number().nullable().optional(),
    is_active: z.boolean().default(true),
    created_at: z.date()
});

export const CreateUserSchema = userSchema.omit({ id: true, created_at: true });
export const UpdateUserSchema = userSchema.partial();

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type User = z.infer<typeof userSchema>;
