import { type PlotConfig } from "../App";
export type plotFnParams = {
  args: string[];
  setPlots: React.Dispatch<React.SetStateAction<PlotConfig[]>>;
  addMessage: (text: string) => void;
  plots: PlotConfig[];
  getNum: (
    index: number,
    defaultVal: number,
  ) => { val: number; strVal: string };
};
