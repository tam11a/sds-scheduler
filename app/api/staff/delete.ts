import { Staff } from "@/lib/generated/prisma/client";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/internal/prismaNamespace";
import { prisma } from "@/lib/prisma";
import { handlePrismaError, ApiResponse } from "@/lib/prisma-error-handler";

export async function deleteStaff(id: number): Promise<ApiResponse<Staff>> {
  try {
    const staff = await prisma.staff.delete({
      where: { id },
    });

    return {
      success: true,
      data: staff,
    };
  } catch (error) {
    return handlePrismaError(error as PrismaClientKnownRequestError);
  }
}
