"use client";

import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { listStaff } from "@/app/api/staff/list";
import useList from "@/components/list/useList";
import useStaffFilter from "./useStaffFilter";

interface Staff {
  id: number;
  full_name: string;
  email: string;
  phone: string;
}

export default function StaffPage() {
  const { search } = useList();
  const { status } = useStaffFilter();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStaff() {
      const response = await listStaff({
        search,
        status,
      });
      setStaffList(response.data);
      setLoading(false);
      console.log("Search Param:", search, response.data);
    }
    fetchStaff();
  }, [search, status]);

  return (
    <div>
      <h1 className="font-medium italic mb-2">Search Term: {search}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : staffList.length > 0 ? (
        staffList.map((staff) => (
          <div key={staff.id}>
            <h2>{staff.full_name}</h2>
            <p>{staff.email}</p>
          </div>
        ))
      ) : (
        <p>No staff found.</p>
      )}
    </div>
  );
}
