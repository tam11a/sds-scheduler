"use server";
import { Schedule } from "@/lib/generated/prisma/client";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/internal/prismaNamespace";
import { prisma } from "@/lib/prisma";
import { handlePrismaError, ApiResponse } from "@/lib/prisma-error-handler";

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

    return {
      success: true,
      data: schedule,
    };
  } catch (error) {
    return handlePrismaError(error as PrismaClientKnownRequestError);
  }
}
