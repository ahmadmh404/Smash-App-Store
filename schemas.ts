import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email not valid",
  }),
  password: z
    .string()
    .min(3, {
      message: "Password must be at least 3 charachters. ",
    })
    .max(20, {
      message: "Passowrd must be at most 20 chrachters",
    }),
});

export type userRole = "admin" | "developer" | "user";
export enum userRoleValues {
  USER = "user",
  DEVELOPER = "developer",
  ADMIN = "admin",
}

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  avatar: z.instanceof(File).optional(),
  type: z.custom<userRole>(),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 charachters. ",
    })
    .max(20, {
      message: "Passowrd must be at most 20 chrachters",
    }),
});

export const newAppSchema = z.object({
  name: z.string({ message: "App name is required" }),
  description: z
    .string({ message: "App description cannot be empty" })
    .max(400),
  version: z.string({ message: "App version is required" }),
  category_id: z.number(),
  requirements: z.string().array(),
  features: z.string().array(),
});
