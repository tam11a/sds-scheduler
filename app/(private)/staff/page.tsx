"use client";

import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { listStaff } from "@/app/api/staff/list";
import useList from "@/components/list/useList";
import useStaffFilter from "./useStaffFilter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Staff } from "@/lib/generated/prisma/client";
import NotApplicable from "@/components/ui/not-applicable";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, StatusIcon } from "@/lib/staff-status";

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffList.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={staff.avatar || ""}
                      alt={staff.full_name}
                    />
                    <AvatarFallback className="bg-emerald-800 text-white">
                      {staff.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{staff.full_name}</span>
                </TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{staff.phone}</TableCell>
                <TableCell>{staff.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {staffList.map((staff) => (
            <Card key={staff.id} className="gap-1 shadow-none">
              <CardHeader className="">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={staff.avatar || ""}
                      alt={staff.full_name}
                    />
                    <AvatarFallback className="bg-emerald-800 text-white">
                      {staff.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{staff.full_name}</CardTitle>
                    <CardDescription className="text-xs">
                      {staff.status}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <table className="text-sm">
                  <tbody>
                    <tr className="leading-loose">
                      <td className="font-medium pr-2 min-w-1/3">Email</td>{" "}
                      <td>{staff.email}</td>
                    </tr>
                    <tr className="leading-loose">
                      <td className="font-medium pr-2 min-w-1/3">Phone</td>{" "}
                      <td>{staff.phone}</td>
                    </tr>
                    <tr className="leading-loose">
                      <td className="font-medium pr-2 min-w-1/3">Type</td>{" "}
                      <td>{staff.support_type || <NotApplicable />}</td>
                    </tr>
                    <tr className="leading-loose">
                      <td className="font-medium pr-2 min-w-1/3">Status</td>{" "}
                      <td>
                        <Badge
                          variant="default"
                          className="text-xs!"
                          style={{
                            backgroundColor: getStatusColor(staff.status),
                          }}
                        >
                          <StatusIcon status={staff.status} />
                          {staff.status}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
