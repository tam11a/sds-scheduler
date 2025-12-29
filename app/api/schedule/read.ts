import { prisma } from "@/lib/prisma";

export async function readSchedule(id: number) {
  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        staff: true,
      },
    });

    if (!schedule) {
      return {
        success: false,
        error: "Schedule not found",
      };
    }

    return {
      success: true,
      data: schedule,
    };
  } catch (error) {
    console.error("Error reading schedule:", error);
    return {
      success: false,
      error: "Failed to read schedule",
    };
  }
}
