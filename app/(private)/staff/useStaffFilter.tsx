"use client";

import { useQueryStates } from "nuqs";
import { staffFilterParams } from "./filterParams";
import { StaffStatus } from "@/lib/generated/prisma/enums";

function useStaffFilter() {
  const [params, setSearchParams] = useQueryStates(staffFilterParams);

  return {
    status: params.status,
    setStatus: (status: StaffStatus) => setSearchParams({ status }),
  };
}

export default useStaffFilter;
