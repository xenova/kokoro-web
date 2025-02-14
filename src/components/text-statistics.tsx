interface TextStatisticsProps {
  text: string;
}

export function TextStatistics({ text }: TextStatisticsProps) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;

  const stats = [
    { label: "Words", value: words },
    { label: "Characters", value: characters },
  ];

  return (
    <div className="flex gap-6 text-sm text-muted-foreground">
      {stats.map(({ label, value }) => (
        <div key={label} className="flex gap-1.5">
          <span className="font-semibold">{label}:</span>
          <span className="font-medium">{value}</span>
        </div>
      ))}
    </div>
  );
}
