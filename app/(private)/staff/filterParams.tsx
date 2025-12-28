import { StaffStatus } from "@/lib/generated/prisma/enums";
import { parseAsStringEnum } from "nuqs/server";

export const staffFilterParams = {
  status: parseAsStringEnum([
    "ALL",
    StaffStatus.ACTIVE,
    StaffStatus.ONBOARDING,
    StaffStatus.TERMINATED,
  ])
    .withDefault("ALL")
    .withOptions({ clearOnDefault: true }),
};
