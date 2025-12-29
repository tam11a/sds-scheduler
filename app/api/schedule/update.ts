"use server";
import { Schedule } from "@/lib/generated/prisma/client";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/internal/prismaNamespace";
import { prisma } from "@/lib/prisma";
import { handlePrismaError, ApiResponse } from "@/lib/prisma-error-handler";
import { revalidateTag } from "next/cache";

export interface UpdateScheduleInput {
  id: number;
  work_time_start?: Date;
  work_time_end?: Date;
  work_address?: string;
  shift_bonus?: number;
  instructions?: string;
}

export async function updateSchedule(
  data: UpdateScheduleInput
): Promise<ApiResponse<Schedule>> {
  try {
    // Get the existing schedule to check staff_id and times
    const existingSchedule = await prisma.schedule.findUnique({
      where: { id: data.id },
      select: {
        staff_id: true,
        work_time_start: true,
        work_time_end: true,
      },
    });

    if (!existingSchedule) {
      return {
        success: false,
        error: "Schedule not found",
      };
    }

    const newStartTime =
      data.work_time_start || existingSchedule.work_time_start;
    const newEndTime = data.work_time_end || existingSchedule.work_time_end;

    // Check for conflicting schedules (excluding the current schedule being updated)
    const conflictingSchedule = await prisma.schedule.findFirst({
      where: {
        id: { not: data.id }, // Exclude current schedule
        staff_id: existingSchedule.staff_id,
        OR: [
          // Updated schedule starts during an existing schedule
          {
            work_time_start: { lte: newStartTime },
            work_time_end: { gt: newStartTime },
          },
          // Updated schedule ends during an existing schedule
          {
            work_time_start: { lt: newEndTime },
            work_time_end: { gte: newEndTime },
          },
          // Updated schedule completely contains an existing schedule
          {
            work_time_start: { gte: newStartTime },
            work_time_end: { lte: newEndTime },
          },
        ],
      },
      include: {
        staff: {
          select: {
            full_name: true,
          },
        },
      },
    });

    if (conflictingSchedule) {
      const conflictStart = new Date(conflictingSchedule.work_time_start);
      const conflictEnd = new Date(conflictingSchedule.work_time_end);
      const formatTime = (date: Date) =>
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      const formatDate = (date: Date) =>
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

      return {
        success: false,
        error: `Schedule conflict: ${
          conflictingSchedule.staff.full_name
        } is already scheduled from ${formatTime(
          conflictStart
        )} to ${formatTime(conflictEnd)} on ${formatDate(
          conflictStart
        )}. Please choose a different time slot.`,
      };
    }

    const schedule = await prisma.schedule.update({
      where: { id: data.id },
      data: {
        work_time_start: data.work_time_start,
        work_time_end: data.work_time_end,
        work_address: data.work_address,
        shift_bonus: data.shift_bonus,
        instructions: data.instructions,
        is_exception: true, // Mark as exception if editing
      },
      include: {
        staff: {
          select: {
            id: true,
            full_name: true,
            avatar: true,
          },
        },
      },
    });

    revalidateTag("schedule-list", "max");
    revalidateTag(`schedule-${data.id}`, "max");

    return {
      success: true,
      data: schedule,
    };
  } catch (error) {
    return handlePrismaError(error as PrismaClientKnownRequestError);
  }
}
