import "./App.css";
import { ActivePlots } from "./components/ActivePlots";
import { NavBar } from "./components/NavBar";
import { CartesianPlan } from "./components/CartesianPlane";
import { useState } from "react";
import { Messages } from "./components/Messages";
import { useCommand } from "./components/useCommand";

export type PlotConfig = {
  id: string;
  type: "quad" | "linear" | "sin" | "cos";
  params: {
    a: { val: number; strVal: string };
    b: { val: number; strVal: string };
    c?: { val: number; strVal: string };
    d?: { val: number; strVal: string };
  };
  mathFunction: (x: number) => number;
  color: string;
  expression: string;
};

export type Settings = {
  viewBox: {
    x: [number, number];
    y: [number, number];
  };
  zoom?: boolean;
};

type Message = {
  text: string;
  id: number;
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
  const { processCommand } = useCommand({
    plots,
    setPlots,
    addMessage,
    setSettings,
  });

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
