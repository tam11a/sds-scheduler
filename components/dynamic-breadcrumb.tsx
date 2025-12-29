"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  staff: "Staff Management",
  scheduler: "Scheduler",
  settings: "Settings",
  reports: "Reports",
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Remove leading slash and split path
  const segments = pathname.split("/").filter(Boolean);

  // Skip the first segment if it's "(private)"
  const pathSegments = segments.filter((seg) => !seg.startsWith("("));

  if (pathSegments.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const label =
            routeLabels[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <div key={segment} className="contents">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
