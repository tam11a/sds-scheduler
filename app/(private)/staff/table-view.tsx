import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Staff } from "@/lib/generated/prisma/client";
import NotApplicable from "@/components/ui/not-applicable";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, StatusIcon } from "@/lib/staff-status";
import { Mars } from "lucide-react";

export default function TableView({ staffList }: { staffList: Staff[] }) {
  return (
    <div className="border rounded-md overflow-hidden p-2">
      <Table className="rounded overflow-hidden">
        <TableHeader className="bg-accent">
          <TableRow>
            <TableHead>Staff</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Support Type</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffList.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={staff.avatar || ""} />
                    <AvatarFallback className="bg-emerald-800 text-white">
                      {staff.full_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{staff.full_name}</span>
                </div>
              </TableCell>
              <TableCell>{staff.email}</TableCell>
              <TableCell>{staff.phone}</TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  <Mars /> {staff.gender}
                </Badge>
              </TableCell>
              <TableCell>{staff.support_type || <NotApplicable />}</TableCell>
              <TableCell>{staff.updatedAt.toLocaleString()}</TableCell>
              <TableCell>{staff.createdAt.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
