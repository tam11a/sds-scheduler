import { parseAsBoolean, parseAsInteger } from "nuqs/server";

export const drawerOpenParams = {
  createSchedule: parseAsBoolean
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(false),
  createStaff: parseAsBoolean
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(false),
  scheduleDetails: parseAsInteger
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(0),
};
