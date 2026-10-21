import { cn } from "@/lib/utils";

/** The flyer's roof-and-hill mark, redrawn as a single gold stroke. */
export function MountainMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 36"
      fill="none"
      aria-hidden="true"
      className={cn("h-6 w-auto", className)}
    >
      <path
        d="M2 30 C 22 28, 34 20, 48 8 C 52 4.5, 56 4.5, 60 8 C 72 19, 86 27, 118 30"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M30 33 C 46 30, 56 24, 64 15 C 74 25, 90 31, 104 33"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
