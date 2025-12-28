import { listStaff } from "@/app/api/staff/list";
import { listSchedules } from "@/app/api/schedule/list";
import { use, useEffect } from "react";

export default function SchedulerPage() {
  const staffResponse = use(listStaff());
  const schedulesResponse = use(listSchedules());

  useEffect(() => {}, []);

  console.log(
    "Scheduler Page Data:",
    staffResponse.data,
    schedulesResponse.data
  );

  return <div>Scheduler Page</div>;
}
