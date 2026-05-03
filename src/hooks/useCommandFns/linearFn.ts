import { type plotFnParams } from "../../types/types";
import { addPlot } from "../useCommandUtils/addPlot";
export function linearFn({
  args,
  setPlots,
  addMessage,
  plots,
  getNum,
}: plotFnParams) {
  if (args.length < 3) {
    addMessage("Error: Insufficient arguments for 'linear' command.");
    return;
  }
  const a = getNum(0, 1);
  const b = getNum(1, 0);
  const id = args[2];
  const color = args[3] || "";

  addPlot("linear", { a, b }, color, id, setPlots, addMessage, plots);
}
