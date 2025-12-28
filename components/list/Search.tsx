"use client";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import useList from "./useList";

export default function ListSearch({
  className,
  ...props
}: React.ComponentProps<"input">) {
  const { search, setSearch } = useList();

  return (
    <Input
      placeholder="Search staff..."
      type="search"
      className={cn("md:min-w-2xs", className)}
      value={search}
      onChange={(e) => setSearch(e.target.value || "")}
      {...props}
    />
  );
}
