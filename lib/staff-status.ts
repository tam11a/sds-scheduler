export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    ONBOARDING: "hsl(210, 100%, 50%)", // Blue
    ACTIVE: "hsl(142, 76%, 36%)", // Green
    ON_LEAVE: "hsl(45, 93%, 47%)", // Yellow
    SUSPENDED: "hsl(0, 84%, 60%)", // Red
    TERMINATED: "hsl(0, 0%, 40%)", // Gray
  };

  return statusColors[status] || "hsl(0, 0%, 60%)";
}
