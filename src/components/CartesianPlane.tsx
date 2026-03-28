import { Mafs, Coordinates, Plot } from "mafs";
import { useState, useEffect } from "react";

type Settings = {
  viewBox: {
    x: [number, number];
    y: [number, number];
  };
};
type PlotConfig = {
  id: string;
  mathFunction: (x: number) => number;
};
type Props = {
  settings: Settings;
  plots: PlotConfig[];
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
        zoom={true}
      >
        <Coordinates.Cartesian subdivisions={1} />
        {plots.map((plot) => (
          <Plot.OfX key={plot.id} y={plot.mathFunction} />
        ))}
      </Mafs>
    </div>
  );
}
