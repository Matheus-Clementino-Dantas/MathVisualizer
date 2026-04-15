import { type PlotConfig } from "../../App";
import { getExpression } from "./getExpression";
export const createPlot = (
  type: PlotConfig["type"],
  params: PlotConfig["params"],
  id: string,
  color: string,
  addMessage: (text: string) => void,
) => {
  if (!isNaN(Number(color))) {
    addMessage(
      `Warning: '${color}' is not a valid color. Applying default color`,
    );
    color = "";
  }

  return {
    id,
    type,
    params,
    mathFunction: (x: number) => {
      const {
        a = { val: 0, strVal: "0" },
        b = { val: 0, strVal: "0" },
        c = { val: 0, strVal: "0" },
        d = { val: 0, strVal: "0" },
      } = params;
      switch (type) {
        case "quad":
          return a.val * x ** 2 + b.val * x + c.val;
        case "linear":
          return a.val * x + b.val;
        case "sin":
          return a.val * Math.sin(b.val * x + c.val) + d.val;
        case "cos":
          return a.val * Math.cos(b.val * x + c.val) + d.val;
        default:
          return 0;
      }
    },
    color,
    expression: getExpression(type, params, addMessage),
  };
};
