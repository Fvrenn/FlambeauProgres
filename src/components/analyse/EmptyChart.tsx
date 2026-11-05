export function EmptyChart({
  message = "Aucune validation sur cette période",
}: {
  message?: string;
}) {
  return (
    <div className="flex h-40 items-center justify-center rounded-ds-md border border-dashed border-dashboard-border">
      <p className="text-tiny text-default-500">{message}</p>
    </div>
  );
}
