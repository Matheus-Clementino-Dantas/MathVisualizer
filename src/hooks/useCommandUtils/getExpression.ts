import { type PlotConfig } from "../../App";
export const getExpression = (
  type: PlotConfig["type"],
  params: PlotConfig["params"],
  addMessage: (text: string) => void,
) => {
  const {
    a,
    b,
    c = { val: 0, strVal: "0" },
    d = { val: 0, strVal: "0" },
  } = params;
  switch (type) {
    case "quad":
      return `f(x) = ${a.strVal} * x² ${b.strVal === "0" ? "" : `+ ${b.strVal}x`} ${c.strVal === "0" ? "" : `+ ${c.strVal}`}`;
    case "linear":
      return `f(x) = ${a.strVal} * x ${b.strVal === "0" ? "" : `+ ${b.strVal}`}`;
    case "sin":
    case "cos":
      return `f(x) = ${a.strVal} * ${type}(${b.strVal} * x${c.strVal === "0" ? "" : ` + ${c.strVal}`}) ${d.strVal === "0" ? "" : `+ ${d.strVal}`}`;
    default:
      addMessage("Error: Expression generation for this type not implemented.");
      return "Error";
  }
};
