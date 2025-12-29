import { getDashboardStats } from "@/app/api/dashboard/stats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  CalendarClock,
  UserPlus,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import { generateColor, getInitials } from "@/lib/generate-color";
import { getStatusColor } from "@/lib/staff-status";

export default async function Page() {
  const statsResponse = await getDashboardStats();

  if (!statsResponse.success || !statsResponse.data) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  const stats = statsResponse.data;

  return (
    <div className="space-y-2">
      {/* Key Metrics */}
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{stats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">
              Active workforce members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Monthly Schedules
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{stats.totalSchedules}</div>
            <p className="text-xs text-muted-foreground">
              Schedules this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Upcoming Schedules
            </CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{stats.upcomingSchedules}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">New Staff</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{stats.newStaff}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-7">
        {/* Staff Status Breakdown */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Staff by Status</CardTitle>
            <CardDescription>
              Current status distribution of all staff members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.staffByStatus.map((item) => {
                const total = stats.totalStaff;
                const percentage = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="default"
                          style={{
                            backgroundColor: getStatusColor(item.status),
                          }}
                        >
                          {item.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {item.count} staff
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getStatusColor(item.status),
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Status */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Onboarding</CardTitle>
            <CardDescription>Staff currently in onboarding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="text-center">
                <p className="text-5xl font-bold">{stats.onboardingStaff}</p>
                <p className="text-sm text-muted-foreground">
                  In onboarding process
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Top Performers</CardTitle>
          </div>
          <CardDescription>
            Staff with most schedules in the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topStaff.map((staff, index) => (
              <div
                key={staff?.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={staff?.avatar || ""} />
                    <AvatarFallback
                      className="text-white"
                      style={{
                        backgroundColor: generateColor(staff?.full_name || ""),
                      }}
                    >
                      {getInitials(staff?.full_name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{staff?.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {staff?.scheduleCount} schedules
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="font-semibold">
                  {staff?.scheduleCount}
                </Badge>
              </div>
            ))}
            {stats.topStaff.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No schedule data available for the last 30 days
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
