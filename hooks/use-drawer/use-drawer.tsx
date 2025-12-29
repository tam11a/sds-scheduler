"use client";

import { useQueryStates } from "nuqs";
import { drawerOpenParams } from "./params";

function useDrawer() {
  const [params, setSearchParams] = useQueryStates(drawerOpenParams);

  return {
    createScheduleOpen: params.createSchedule,
    setCreateScheduleOpen: (open: boolean) =>
      setSearchParams({ createSchedule: open }),
    createStaffOpen: params.createStaff,
    setCreateStaffOpen: (open: boolean) =>
      setSearchParams({ createStaff: open }),
  };
}

export default useDrawer;
