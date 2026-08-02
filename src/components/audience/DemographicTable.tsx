import type { DemographicDatum } from "@/components/audience/DemographicBarChart";

/** Accessible, chart-independent fallback — same data, plain HTML table. */
export function DemographicTable({
  title,
  data,
}: {
  title: string;
  data: DemographicDatum[];
}) {
  return (
    <details className="mt-3 text-sm">
      <summary className="focus-ring cursor-pointer rounded text-ink-faint hover:text-ink-muted">
        Ver &quot;{title}&quot; como tabla
      </summary>
      <table className="mt-3 w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
            <th scope="col" className="py-2 pr-4 font-medium">
              Categoría
            </th>
            <th scope="col" className="py-2 font-medium">
              Porcentaje
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.label} className="border-b border-line/60">
              <td className="py-2 pr-4 text-ink-muted">{row.label}</td>
              <td className="py-2 font-medium text-ink">{row.percent}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
