export function StatsSection(): React.JSX.Element {
  const stats = [
    { value: "8.5/10", label: "Average Discipline Score" },
    { value: "12,847", label: "Journal Entries Created" },
    { value: "74%", label: "Improved Win Rate" },
  ] as const;

  return (
    <section className="bg-muted/50 py-24" aria-labelledby="stats-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="stats-heading" className="text-3xl font-bold mb-4">
            Real Trader Development Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our psychology-focused approach delivers measurable improvements in mental game performance
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center" role="list">
          {stats.map((stat) => (
            <div key={stat.label} role="listitem">
              <div className="text-4xl font-bold mb-2 text-primary" aria-label={`${stat.value} ${stat.label}`}>
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label === "Average Discipline Score" && "Consistent routine adherence"}
                {stat.label === "Journal Entries Created" && "Psychology insights documented"}
                {stat.label === "Improved Win Rate" && "Through mental game mastery"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
