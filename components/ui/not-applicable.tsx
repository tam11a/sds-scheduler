import { cn } from "@/lib/utils";

export default function NotApplicable({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span className={cn("text-muted-foreground", className)} {...props}>
      N/A
    </span>
  );
}
