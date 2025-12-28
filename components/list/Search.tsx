import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

export default function ListSearch({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      placeholder="Search staff..."
      type="search"
      className={cn("md:min-w-2xs", className)}
      // onChange={(e) => onSearch?.(e.target.value || "")}
      {...props}
    />
  );
}
