import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollContainerProps extends React.PropsWithChildren {
  onBottomReached: () => void;
  className?: string;
}

export function InfiniteScrollContainer({
  className,
  onBottomReached,
  children,
}: InfiniteScrollContainerProps) {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    },
  });
  return (
    <div className={cn(`w-full`, className ?? "")}>
      {children}
      <div ref={ref} />
    </div>
  );
}
