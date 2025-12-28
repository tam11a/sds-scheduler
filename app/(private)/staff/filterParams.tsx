import { StaffStatus } from "@/lib/generated/prisma/enums";
import { parseAsStringEnum } from "nuqs/server";

export const staffFilterParams = {
  status: parseAsStringEnum([
    StaffStatus.ACTIVE,
    StaffStatus.ONBOARDING,
    StaffStatus.TERMINATED,
  ])
    .withDefault(StaffStatus.ONBOARDING)
    .withOptions({ clearOnDefault: true }),
};
