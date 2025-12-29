"use server";
import { prisma } from "@/lib/prisma";
import { StaffStatus } from "@/lib/generated/prisma/enums";

export async function getDashboardStats() {
  try {
    // Get total staff count
    const totalStaff = await prisma.staff.count();

    // Get staff by status
    const staffByStatus = await prisma.staff.groupBy({
      by: ["status"],
      _count: true,
    });

    // Get total schedules for current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const totalSchedules = await prisma.schedule.count({
      where: {
        work_time_start: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    // Get upcoming schedules (next 7 days)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const upcomingSchedules = await prisma.schedule.count({
      where: {
        work_time_start: {
          gte: startOfToday,
          lte: endOfWeek,
        },
      },
    });

    // Get new staff (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newStaff = await prisma.staff.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get onboarding staff (status = ONBOARDING)
    const onboardingStaff = await prisma.staff.count({
      where: {
        status: StaffStatus.ONBOARDING,
      },
    });

    // Get schedules by staff for top performers (last 30 days)
    const topStaff = await prisma.schedule.groupBy({
      by: ["staff_id"],
      where: {
        work_time_start: {
          gte: thirtyDaysAgo,
        },
      },
      _count: true,
      orderBy: {
        _count: {
          staff_id: "desc",
        },
      },
      take: 5,
    });

    // Get staff details for top performers
    const topStaffDetails = await Promise.all(
      topStaff.map(async (item) => {
        const staff = await prisma.staff.findUnique({
          where: { id: item.staff_id },
          select: {
            id: true,
            full_name: true,
            avatar: true,
          },
        });
        return {
          ...staff,
          scheduleCount: item._count,
        };
      })
    );

    return {
      success: true,
      data: {
        totalStaff,
        staffByStatus: staffByStatus.map((s) => ({
          status: s.status,
          count: s._count,
        })),
        totalSchedules,
        upcomingSchedules,
        newStaff,
        onboardingStaff,
        topStaff: topStaffDetails,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error: "Failed to fetch dashboard statistics",
    };
  }
}
