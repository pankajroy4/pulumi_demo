type Status = "healthy" | "error" | "loading";

export function StatusDot({ status }: { status: Status }) {
  const colors: Record<Status, string> = {
    healthy: "green",
    error: "red",
    loading: "yellow",
  };

  return <span className={colors[status]} />;
}
