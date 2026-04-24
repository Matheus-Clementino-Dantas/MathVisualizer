import { type PlotConfig } from "../../App";
import { addPlot } from "../useCommandUtils/addPlot";
export function cosSinFn(
  args: string[],
  setPlots: React.Dispatch<React.SetStateAction<PlotConfig[]>>,
  addMessage: (text: string) => void,
  plots: PlotConfig[],
  getNum: (
    index: number,
    defaultVal: number,
  ) => { val: number; strVal: string },
  type: "cos" | "sin",
) {
  if (args.length < 5) {
    addMessage(`Error: Insufficient arguments for '${type}' command.`);
  }
  const a = getNum(0, 1);
  const b = getNum(1, 1);
  const c = getNum(2, 0);
  const d = getNum(3, 0);
  const id = args[4];
  const color = args[5] || "";

  addPlot(type, { a, b, c, d }, color, id, setPlots, addMessage, plots);
}
