import { type PlotConfig } from "../App";

export function ActivePlots({ plots }: { plots: PlotConfig[] }) {
  //if (plots.length === 0) return;
  return (
    <div className="fixed top-15 sm:top-17 left-1/2 -translate-x-1/2 flex flex-col gap-2 h-max w-11/12 sm:translate-x-0 sm:left-4 sm:w-auto">
      {plots.map((plot) => (
        <div
          className="flex items-center gap-2 bg-layer rounded-lg py-1 px-2"
          key={plot.id}
        >
          <div
            className="rounded-full h-4 w-4"
            style={{ backgroundColor: plot.color || "var(--plot)" }}
          ></div>
          <h3 className="font-site tracking-wide text-text/80 text-sm">
            {plot.id}:
          </h3>
          <h3 className="font-site tracking-wide text-text/80 text-sm">
            {plot.expression}
          </h3>
        </div>
      ))}
    </div>
  );
}
