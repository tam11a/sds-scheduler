import { z } from "zod";

export const scheduleCreateSchema = z.object({
  staff_id: z.number().int().positive("Staff is required"),
  work_time_start: z.iso.datetime("Invalid start time"),
  work_time_end: z.iso.datetime("Invalid end time"),
  work_address: z.string().min(1, "Work address is required"),
  shift_bonus: z.number().optional(),
  instructions: z.string().optional(),
});

export type CreateScheduleInput = z.infer<typeof scheduleCreateSchema>;
