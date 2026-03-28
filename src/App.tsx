import "./App.css";
import { ActivePlots } from "./components/ActivePlots";
import { NavBar } from "./components/NavBar";
import { CartesianPlan } from "./components/CartesianPlane";
import { useState } from "react";
import { Messages } from "./components/Messages";

export type PlotConfig = {
  id: string;
  mathFunction: (x: number) => number;
  color?: string;
  expression: string;
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

    const getNum = (index: number, defaultVal: number) => {
      if (args[index] === undefined) return defaultVal;
      const num = Number(args[index]);
      return isNaN(num) ? defaultVal : num;
    };

    if (cmd === "quad") {
      const a = getNum(0, 1);
      const b = getNum(1, 0);
      const c = getNum(2, 0);
      const id = args[3] || crypto.randomUUID();
      const color = args[4] || "";

      const newPlot: PlotConfig = {
        id,
        mathFunction: (x) => a * x ** 2 + b * x + c,
        color,
        expression: `f(x) = ${a}x² + ${b}x + ${c}`,
      };
      setPlots((prev) => [...prev, newPlot]);
      addMessage(`quad '${id}' plotted.`);
      return;
    }

    if (cmd === "linear") {
      const a = getNum(0, 1);
      const b = getNum(1, 0);
      const id = args[2] || crypto.randomUUID();
      const color = args[3] || "";

      const newPlot: PlotConfig = {
        id,
        mathFunction: (x) => a * x + b,
        color,
        expression: `f(x) = ${a}x + ${b}`,
      };
      setPlots((prev) => [...prev, newPlot]);
      addMessage(`Linear '${id}' plotted.`);
      return;
    }

    if (cmd === "sin" || cmd === "cos") {
      const a = getNum(0, 1);
      const b = getNum(1, 1);
      const c = getNum(2, 0);
      const d = getNum(3, 0);
      const id = args[4] || crypto.randomUUID();
      const color = args[5] || "";

      const newPlot: PlotConfig = {
        id,
        mathFunction: (x) =>
          cmd === "sin"
            ? a * Math.sin(b * x + c) + d
            : a * Math.cos(b * x + c) + d,
        color,
        expression: `f(x) = ${a} * ${cmd}(${b}x + ${c}) + ${d}`,
      };
      setPlots((prev) => [...prev, newPlot]);
      addMessage(`Function ${cmd} '${id}' plotted.`);
      return;
    }
    if (cmd === "viewbox") {
      const xMin = getNum(0, -10);
      const xMax = getNum(1, 10);
      const yMin = getNum(2, -10);
      const yMax = getNum(3, 10);

      setSettings((prev) => ({
        ...prev,
        viewBox: { x: [xMin, xMax], y: [yMin, yMax] },
      }));
      addMessage(`ViewBox updated: X:[${xMin}, ${xMax}] Y:[${yMin}, ${yMax}]`);
      return;
    }

    if (cmd === "zoom") {
      const zoomValue = args[0] || "on";
      setSettings((prev) => ({
        ...prev,
        zoom: zoomValue === "on",
      }));
      addMessage(`Zoom ${zoomValue}`);
      return;
    }

    if (cmd === "remove") {
      const idToRemove = args[0];
      if (!idToRemove) {
        addMessage("Error: Specify an ID to remove. Usage: remove [id]");
        return;
      }
      setPlots((prev) => prev.filter((plot) => plot.id !== idToRemove));
      addMessage(`Plot '${idToRemove}' removed.`);
      return;
    }

    if (cmd === "clear") {
      setPlots([]);
      addMessage("Cartesian plane cleared.");
      return;
    }

    addMessage(`Error: Command '${cmd}' not recognized.`);
  };
  return (
    <div className="h-screen bg-bg ">
      <NavBar processCommand={processCommand} />
      <CartesianPlan settings={settings} plots={plots} />
      <Messages messages={messages} setMessages={setMessages} />
      <ActivePlots plots={plots} />
    </div>
  );
}

export default App;
