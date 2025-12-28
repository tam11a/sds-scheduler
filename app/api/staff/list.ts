"use server";

import { StaffStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

interface StaffFilters {
  search?: string;
  status?: StaffStatus;
}

export async function listStaff(filters?: StaffFilters) {
  console.log("Filters in listStaff:", filters);
  try {
    const staffMembers = await prisma.staff.findMany({
      where: {
        OR: [
          {
            full_name: { contains: filters?.search || "" },
          },
          { email: { contains: filters?.search || "" } },
          { phone: { contains: filters?.search || "" } },
        ],
        // Add more filters as needed
        AND: [{ status: filters?.status }],
      },
    });
    return { message: "List of staff members", data: staffMembers };
  } catch {
    return { message: "List of staff members", data: [] };
  }
}
