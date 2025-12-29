"use server";

import { prisma } from "@/lib/prisma";
import { StaffStatus } from "@/lib/generated/prisma/enums";
import { handlePrismaError, ApiResponse } from "@/lib/prisma-error-handler";
import { Staff } from "@/lib/generated/prisma/client";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/internal/prismaNamespace";
import { CreateStaffInput } from "./schema";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createStaff(
  data: CreateStaffInput
): Promise<ApiResponse<Staff>> {
  try {
    const staff = await prisma.staff.create({
      data: {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        avatar: data.avatar,
        address: data.address,
        status: data.status || StaffStatus.ONBOARDING,
        support_type: data.support_type,
        preferred_weekly_working_hours: data.preferred_weekly_working_hours,
        preferred_work_starting_date: data.preferred_work_starting_date,
        preferred_work_address: data.preferred_work_address,
      },
    });

    revalidateTag("staff-list", "max");
    revalidatePath("/(private)/staff", "page");
    return {
      success: true,
      data: staff,
    };
  } catch (error) {
    return handlePrismaError(error as PrismaClientKnownRequestError);
  }
}
