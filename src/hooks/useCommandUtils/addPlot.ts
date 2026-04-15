import { type PlotConfig } from "../../App";
import { createPlot } from "./createPlot";
export function addPlot(
  type: PlotConfig["type"],
  params: PlotConfig["params"],
  color: string,
  id: string,
  setPlots: React.Dispatch<React.SetStateAction<PlotConfig[]>>,
  addMessage: (text: string) => void,
  plots: PlotConfig[],
) {
  if (!id) {
    addMessage(`Error: '${type}' command requires an ID as the 4th argument.`);
    return;
  }

  if (plots.some((p) => p.id === id)) {
    addMessage(`Error: ID '${id}' already exists.`);
    return;
  }

  const newPlot = createPlot(type, params, id, color, addMessage);

  if (!newPlot) return;

  setPlots((prev) => [...prev, newPlot]);
  addMessage(` ${type} '${id}' plotted.`);
}
