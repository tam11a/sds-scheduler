"use client";

import { useEffect, useState } from "react";
import { listStaff } from "@/app/api/staff/list";
import useList from "@/components/list/useList";
import useStaffFilter from "./useStaffFilter";

import { Staff } from "@/lib/generated/prisma/client";
import GridView from "./grid-view";
import TableView from "./table-view";

export default function StaffPage() {
  const { search, view } = useList();
  const { status } = useStaffFilter();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStaff() {
      const response = await listStaff({
        search,
        status,
      });
      setStaffList(response.data as Staff[]);
      setLoading(false);
      console.log("Search Param:", search, response.data);
    }
    fetchStaff();
  }, [search, status]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (staffList.length === 0) {
    return <p>No staff found.</p>;
  }

  return (
    <div>
      {view === "table-view" ? (
        <TableView staffList={staffList} />
      ) : (
        <GridView staffList={staffList} />
      )}
    </div>
  );
}
