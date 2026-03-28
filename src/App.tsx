import "./App.css";
import { NavBar } from "./components/NavBar";
import { CartesianPlan } from "./components/CartesianPlane";
import { useState } from "react";
import { Messages } from "./components/Messages";

type PlotConfig = {
  id: string;
  mathFunction: (x: number) => number;
  color?: string;
};

type Message = {
  text: string;
  id: number;
};

type Settings = {
  viewBox: {
    x: [number, number];
    y: [number, number];
  };
  zoom?: boolean;
};

function App() {
  const [plots, setPlots] = useState<PlotConfig[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<Settings>({
    viewBox: { x: [-10, 10], y: [-10, 10] },
  });
  const addMessage = (text: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), text: text }]);
  };
  const processCommand = (input: string) => {
    const [cmd, ...args] = input.trim().toLowerCase().split(/\s+/);
    const a = Number(args[0]);
    const b = Number(args[1]);
    const c = Number(args[2]);
    const d = Number(args[3]);
    const name = args[4];
    const color = args[5] || "";
    if (cmd === "quad") {
      const newPlot: PlotConfig = {
        id: name,
        mathFunction: (x) => a || 1 * x ** 2 + b || 0 * x + c || 0,
        color: color,
      };
      setPlots([...plots, newPlot]);
      return;
    }
    if (cmd === "linear") {
      const newPlot: PlotConfig = {
        id: name,
        mathFunction: (x) => a || 0 * x + b || 1,
        color: color,
      };
      setPlots([...plots, newPlot]);
      return;
    }
    if (cmd === "sin") {
      const newPlot: PlotConfig = {
        id: name,
        mathFunction: (x) => a || 1 * Math.sin(b || 1 * x + c || 0) + d || 0,
        color: color,
      };
      setPlots([...plots, newPlot]);
      return;
    }
    if (cmd === "cos") {
      const newPlot: PlotConfig = {
        id: name,
        mathFunction: (x) => a || 1 * Math.cos(b || 1 * x + c || 0) + d || 0,
        color: color,
      };
      setPlots([...plots, newPlot]);
      return;
    }
    if (cmd === "viewbox") {
      setSettings({
        viewBox: {
          x: [a || -10, b || 10],
          y: [c || -10, d || 10],
        },
      });
      return;
    }
    if (cmd === "zoom") {
      const zoom = a || "on";
      setSettings((prev) => ({
        ...prev,
        zoom: zoom === "on" ? true : false,
      }));
      return;
    }
    if (cmd === "remove") {
      setPlots(plots.filter((plot) => plot.id !== args[0]));
      return;
    }
    if (cmd === "clear") {
      setPlots([]);
      return;
    }
    addMessage("Unknown command");
  };

  return (
    <div className="h-screen bg-bg ">
      <NavBar processCommand={processCommand} />
      <CartesianPlan settings={settings} plots={plots} />
      <Messages messages={messages} setMessages={setMessages} />
    </div>
  );
}

export default App;
