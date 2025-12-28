"use server";
import { Schedule } from "@/lib/generated/prisma/client";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/internal/prismaNamespace";
import { prisma } from "@/lib/prisma";
import { handlePrismaError, ApiResponse } from "@/lib/prisma-error-handler";

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
          },
        },
      },
    });

    return {
      success: true,
      data: schedule,
    };
  } catch (error) {
    return handlePrismaError(error as PrismaClientKnownRequestError);
  }
}
