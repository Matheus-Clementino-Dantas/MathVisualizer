import { type PlotConfig } from "../../App";
import { addPlot } from "../useCommandUtils/addPlot";
export function quadFn(
  args: string[],
  setPlots: React.Dispatch<React.SetStateAction<PlotConfig[]>>,
  addMessage: (text: string) => void,
  plots: PlotConfig[],
  getNum: (
    index: number,
    defaultVal: number,
  ) => { val: number; strVal: string },
) {
  if (args.length < 4) {
    addMessage("Error: Insufficient arguments for 'quad' command.");
    return;
  }
  const a = getNum(0, 1);
  const b = getNum(1, 0);
  const c = getNum(2, 0);
  const id = args[3];
  const color = args[4] || "";
  addPlot("quad", { a, b, c }, color, id, setPlots, addMessage, plots);
}
