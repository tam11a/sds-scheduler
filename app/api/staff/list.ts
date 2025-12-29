"use server";

import { StaffStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { cacheTag } from "next/cache";

interface StaffFilters {
  search?: string;
  status?: StaffStatus | "ALL";
}

export async function listStaff(filters?: StaffFilters) {
  "use cache";
  cacheTag("staff-list");
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
        AND:
          filters?.status && filters.status !== "ALL"
            ? [{ status: filters.status }]
            : [],
      },
    });
    return { message: "List of staff members", data: staffMembers };
  } catch {
    return { message: "List of staff members", data: [] };
  }
}
