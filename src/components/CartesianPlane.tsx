import { Mafs, Coordinates, Plot, labelPi } from "mafs";
import { useState, useEffect } from "react";
import { type Settings } from "../App";

type PlotConfig = {
  id: string;
  mathFunction: (x: number) => number;
  color?: string;
};

type Props = {
  plots: PlotConfig[];
  settings: Settings;
};

export function CartesianPlan({ settings, plots }: Props) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-full w-full justify-center items-center flex vignette">
      <Mafs
        width={size.width}
        height={size.height}
        viewBox={settings.viewBox}
        zoom={settings.zoom}
        preserveAspectRatio={settings.aspRatio}
        pan={settings.pan}
      >
        <Coordinates.Cartesian
          subdivisions={1}
          yAxis={{
            lines: settings.labelY,
            labels: settings.labelY === Math.PI ? labelPi : (n) => n,
          }}
          xAxis={{
            lines: settings.labelX,
            labels: settings.labelX === Math.PI ? labelPi : (n) => n,
          }}
        />
        {plots.map((plot) => (
          <Plot.OfX key={plot.id} y={plot.mathFunction} color={plot.color} />
        ))}
      </Mafs>
    </div>
  );
}
