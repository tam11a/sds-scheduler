import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NotApplicable from "@/components/ui/not-applicable";
import { Staff } from "@/lib/generated/prisma/client";
import { getStatusColor, StatusIcon } from "@/lib/staff-status";
import { generateColor, getInitials } from "@/lib/generate-color";

export default function GridView({ staffList }: { staffList: Staff[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {staffList.map((staff) => (
        <Card key={staff.id} className="gap-1 shadow-none">
          <CardHeader className="">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={staff.avatar || ""} alt={staff.full_name} />
                <AvatarFallback
                  className="text-white"
                  style={{ backgroundColor: generateColor(staff.full_name) }}
                >
                  {getInitials(staff.full_name)}
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
            <table className="text-sm w-full">
              <tbody>
                <tr className="leading-loose">
                  <td className="font-medium pr-2 min-w-1/3">Email</td>{" "}
                  {/* 
                  TODO: Handle long email addresses with ellipsis and tooltip
                  */}
                  <td className="text-ellipsis">{staff.email}</td>
                </tr>
                <tr className="leading-loose">
                  <td className="font-medium pr-2 min-w-1/3">Phone</td>{" "}
                  <td className="text-ellipsis">{staff.phone}</td>
                </tr>
                <tr className="leading-loose">
                  <td className="font-medium pr-2 min-w-1/3">Support Type</td>{" "}
                  <td className="text-ellipsis">
                    {staff.support_type || <NotApplicable />}
                  </td>
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
  );
}
