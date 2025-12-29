import { Gender, StaffStatus, SupportType } from "@/lib/generated/prisma/enums";
import z from "zod";

export const staffCreateSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 digits"),
  gender: z.enum(Gender),
  avatar: z.url().optional(),
  address: z.string().optional(),
  status: z.enum(StaffStatus).optional(),
  support_type: z.enum(SupportType).optional(),
  preferred_weekly_working_hours: z.number().optional(),
  preferred_work_starting_date: z.date().optional(),
  preferred_work_address: z.string().optional(),
});

export type CreateStaffInput = z.infer<typeof staffCreateSchema>;
