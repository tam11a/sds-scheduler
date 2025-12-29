import { prisma } from "@/lib/prisma";
import { handlePrismaError, ApiResponse } from "@/lib/prisma-error-handler";
import { Gender, SupportType, StaffStatus } from "@/lib/generated/prisma/enums";
import { Staff } from "@/lib/generated/prisma/client";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/internal/prismaNamespace";

export interface UpdateStaffInput {
  id: number;
  full_name?: string;
  email?: string;
  phone?: string;
  gender?: Gender;
  avatar?: string;
  address?: string;
  status?: StaffStatus;
  support_type?: SupportType;
  preferred_weekly_working_hours?: number;
  preferred_work_starting_date?: Date;
  preferred_work_address?: string;
}

export async function updateStaff(
  data: UpdateStaffInput
): Promise<ApiResponse<Staff>> {
  try {
    const staff = await prisma.staff.update({
      where: { id: data.id },
      data: {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        avatar: data.avatar,
        address: data.address,
        status: data.status,
        support_type: data.support_type,
        preferred_weekly_working_hours: data.preferred_weekly_working_hours,
        preferred_work_starting_date: data.preferred_work_starting_date,
        preferred_work_address: data.preferred_work_address,
      },
    });

    return {
      success: true,
      data: staff,
    };
  } catch (error) {
    return handlePrismaError(error as PrismaClientKnownRequestError);
  }
}
