"use server";
import { prisma } from "@/lib/prisma";

interface ScheduleFilters {
  startDate?: Date;
  endDate?: Date;
  staffIds?: number[];
}

export async function listSchedules(filters?: ScheduleFilters) {
  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        work_time_start: {
          gte: filters?.startDate,
          lte: filters?.endDate,
        },
        ...(filters?.staffIds && {
          staff_id: { in: filters.staffIds },
        }),
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
      orderBy: {
        work_time_start: "asc",
      },
    });

    return {
      success: true,
      data: schedules,
    };
  } catch {
    return { message: "List of schedules", data: [] };
  }
}
