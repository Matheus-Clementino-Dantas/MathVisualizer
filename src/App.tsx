import "./App.css";
import { NavBar } from "./components/NavBar";
import { CartesianPlan } from "./components/CartesianPlane";
import { useState } from "react";

type PlotConfig = {
  id: string;
  mathFunction: (x: number) => number;
};

type Settings = {
  viewBox: {
    x: [number, number];
    y: [number, number];
  };
};

function App() {
  const [plots, setPlots] = useState<PlotConfig[]>([]);
  const [settings, setSettings] = useState<Settings>({
    viewBox: { x: [-10, 10], y: [-10, 10] },
  });
  const processCommand = (input: string) => {
    const [cmd, ...args] = input.trim().toLowerCase().split(/\s+/);

    if (cmd === "quad") {
      const a = Number(args[0]) || 1;
      const b = Number(args[1]) || 0;
      const c = Number(args[2]) || 0;
      const newPlot: PlotConfig = {
        id: crypto.randomUUID(),
        mathFunction: (x) => a * x ** 2 + b * x + c,
      };
      setPlots([...plots, newPlot]);
    }
    if (cmd === "linear") {
      const a = Number(args[0]) || 0;
      const b = Number(args[1]) || 1;

      const newPlot: PlotConfig = {
        id: crypto.randomUUID(),
        mathFunction: (x) => a * x + b,
      };
      setPlots([...plots, newPlot]);
    }
    if (cmd === "sin") {
      const a = Number(args[0]) || 1;
      const b = Number(args[1]) || 0;
      const c = Number(args[2]) || 0;
      const d = Number(args[3]) || 0;
      const newPlot: PlotConfig = {
        id: crypto.randomUUID(),
        mathFunction: (x) => a * Math.sin(b * x + c) + d,
      };
      setPlots([...plots, newPlot]);
    }
    if (cmd === "cos") {
      const a = Number(args[0]) || 1;
      const b = Number(args[1]) || 0;
      const c = Number(args[2]) || 0;
      const d = Number(args[3]) || 0;
      const newPlot: PlotConfig = {
        id: crypto.randomUUID(),
        mathFunction: (x) => a * Math.cos(b * x + c) + d,
      };
      setPlots([...plots, newPlot]);
    }
    if (cmd === "viewBox") {
      const a = Number(args[0]) || -1;
      const b = Number(args[1]) || 1;
      const c = Number(args[2]) || -1;
      const d = Number(args[3]) || 1;
      setSettings({
        viewBox: {
          x: [a, b],
          y: [c, d],
        },
      });
    }
    if (cmd === "clear") setPlots([]);
  };

  return (
    <div className="h-screen bg-bg ">
      <NavBar processCommand={processCommand} />
      <CartesianPlan settings={settings} plots={plots} />
    </div>
  );
}

export default App;
