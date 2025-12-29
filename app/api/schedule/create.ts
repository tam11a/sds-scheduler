"use server";
import { Schedule } from "@/lib/generated/prisma/client";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/internal/prismaNamespace";
import { prisma } from "@/lib/prisma";
import { handlePrismaError, ApiResponse } from "@/lib/prisma-error-handler";
import { revalidateTag } from "next/cache";

export interface CreateScheduleInput {
  staff_id: number;
  work_time_start: Date;
  work_time_end: Date;
  work_address: string;
  shift_bonus?: number;
  instructions?: string;
  series_id?: number;
}

export async function createSchedule(
  data: CreateScheduleInput
): Promise<ApiResponse<Schedule>> {
  try {
    // Check for conflicting schedules
    const conflictingSchedule = await prisma.schedule.findFirst({
      where: {
        staff_id: data.staff_id,
        OR: [
          // New schedule starts during an existing schedule
          {
            work_time_start: { lte: data.work_time_start },
            work_time_end: { gt: data.work_time_start },
          },
          // New schedule ends during an existing schedule
          {
            work_time_start: { lt: data.work_time_end },
            work_time_end: { gte: data.work_time_end },
          },
          // New schedule completely contains an existing schedule
          {
            work_time_start: { gte: data.work_time_start },
            work_time_end: { lte: data.work_time_end },
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

    const schedule = await prisma.schedule.create({
      data: {
        staff_id: data.staff_id,
        work_time_start: data.work_time_start,
        work_time_end: data.work_time_end,
        work_address: data.work_address,
        shift_bonus: data.shift_bonus,
        instructions: data.instructions,
        series_id: data.series_id,
      },
      include: {
        staff: {
          select: {
            id: true,
            full_name: true,
            avatar: true,
            status: true,
          },
        },
      },
    });

    // Update staff status from ONBOARDING to ACTIVE if this is their first schedule
    if (schedule.staff.status === "ONBOARDING") {
      await prisma.staff.update({
        where: { id: data.staff_id },
        data: { status: "ACTIVE" },
      });
    }

    revalidateTag("schedule-list", "max");

    return {
      success: true,
      data: schedule,
    };
  } catch (error) {
    return handlePrismaError(error as PrismaClientKnownRequestError);
  }
}
