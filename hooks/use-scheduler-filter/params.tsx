import { parseAsIsoDateTime, parseAsStringEnum } from "nuqs/server";

export enum SchedulerView {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export const schedulerFilterParams = {
  view: parseAsStringEnum([SchedulerView.WEEKLY, SchedulerView.MONTHLY])
    .withDefault(SchedulerView.WEEKLY)
    .withOptions({ clearOnDefault: true }),
  currentDate: parseAsIsoDateTime
    .withDefault(new Date())
    .withOptions({ clearOnDefault: true }),
};
