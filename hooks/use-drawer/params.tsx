import { parseAsBoolean } from "nuqs/server";

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
};
