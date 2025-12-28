"use client";

import { useEffect, useState } from "react";
import { listStaff } from "@/app/api/staff/list";
import useList from "@/components/list/useList";
import useStaffFilter from "./useStaffFilter";

import { Staff } from "@/lib/generated/prisma/client";
import GridView from "./grid-view";
import TableView from "./table-view";

import { RefreshCcwIcon, Users2 } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { notFound } from "next/navigation";

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

  // Loading State
  if (loading) {
    return (
      <Empty className="from-muted/80 to-background h-full bg-linear-to-b from-30%">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <RefreshCcwIcon className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>Loading Staff...</EmptyTitle>
          <EmptyDescription>
            Please wait while we load the staff members.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  // No Data State
  if (staffList.length === 0) {
    return (
      <Empty className="from-muted/80 to-background h-full bg-linear-to-b from-30%">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users2 />
          </EmptyMedia>
          <EmptyTitle>No Staff</EmptyTitle>
          <EmptyDescription>
            No staff members found. Try adjusting your filters or adding new
            staff.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  // Data Loaded State
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
