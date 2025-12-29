"use server";
import { Schedule } from "@/lib/generated/prisma/client";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/internal/prismaNamespace";
import { prisma } from "@/lib/prisma";
import { handlePrismaError, ApiResponse } from "@/lib/prisma-error-handler";

export async function deleteSchedule(
  id: number
): Promise<ApiResponse<Schedule>> {
  try {
    const schedule = await prisma.schedule.delete({
      where: { id },
    });

    return {
      success: true,
      data: schedule,
    };
  } catch (error) {
    return handlePrismaError(error as PrismaClientKnownRequestError);
  }
}
