import { Activity, BadgePlus, HatGlasses, ShieldMinus } from "lucide-react";
import { StaffStatus } from "./generated/prisma/enums";
import React from "react";

export const staffWithIconsStatus = [
  { value: StaffStatus.ONBOARDING, icon: BadgePlus },
  { value: StaffStatus.ACTIVE, icon: Activity },
  { value: StaffStatus.TERMINATED, icon: ShieldMinus },
];

const statusToColorMap: Record<StaffStatus, string> = {
  [StaffStatus.ONBOARDING]: "oklch(70.5% 0.213 47.604)",
  [StaffStatus.ACTIVE]: "oklch(76.8% 0.233 130.85)",
  [StaffStatus.TERMINATED]: "oklch(63.7% 0.237 25.331)",
};

export function getStatusColor(status: StaffStatus): string {
  return statusToColorMap[status];
}

export function StatusIcon({
  status,
}: {
  status: StaffStatus;
}): React.JSX.Element {
  const statusObj = staffWithIconsStatus.find((s) => s.value === status);
  return statusObj ? <statusObj.icon /> : <HatGlasses />;
}
