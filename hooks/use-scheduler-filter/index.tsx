"use client";

import { useQueryStates } from "nuqs";
import { StaffStatus } from "@/lib/generated/prisma/enums";
import { staffFilterParams } from "@/app/(private)/staff/filterParams";
import { schedulerFilterParams, SchedulerView } from "./params";

function useSchedulerFilter() {
  const [params, setSearchParams] = useQueryStates(staffFilterParams);
  const [params2, setSearchParams2] = useQueryStates(schedulerFilterParams);

  return {
    status: params.status,
    setStatus: (status: StaffStatus) => setSearchParams({ status }),
    view: params2.view,
    setView: (view: SchedulerView) => setSearchParams2({ view }),
    currentDate: params2.currentDate,
    setCurrentDate: (date: Date) => setSearchParams2({ currentDate: date }),
  };
}

export default useSchedulerFilter;
