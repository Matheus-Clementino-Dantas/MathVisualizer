import { type Dispatch, type SetStateAction } from "react";
import { type PlotConfig, type Settings } from "../App";
import { quadFn } from "./useCommandFns/quadFn";
import { linearFn } from "./useCommandFns/linearFn";
import { cosSinFn } from "./useCommandFns/cosSinFn";

type UseCommandProps = {
  plots: PlotConfig[];
  setPlots: Dispatch<SetStateAction<PlotConfig[]>>;
  addMessage: (text: string) => void;
  setSettings: Dispatch<SetStateAction<Settings>>;
};

export function useCommand({
  plots,
  setPlots,
  addMessage,
  setSettings,
}: UseCommandProps) {
  const processCommand = (input: string) => {
    const [cmd, ...args] = input.trim().toLowerCase().split(/\s+/);

    const createPlot = (
      type: PlotConfig["type"],
      params: PlotConfig["params"],
      id: string,
      color: string,
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
        expression: getExpression(type, params),
      };
    };

    const getNum = (index: number, defaultVal: number) => {
      const arg = args[index];

      const fallback = {
        val: defaultVal,
        strVal: defaultVal.toString(),
      };

      if (arg === undefined || arg === "_") return fallback;

      const raw = arg.toLowerCase().replace("pi", "π");

      if (raw === "π") {
        return { val: Math.PI, strVal: raw };
      }

      if (raw.includes("/")) {
        const [numStr, denStr] = raw.split("/");

        if (!numStr || !denStr) return fallback;

        const numerator = numStr === "π" ? Math.PI : Number(numStr);
        const denominator = Number(denStr);

        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
          return { val: numerator / denominator, strVal: raw };
        }

        return fallback;
      }

      const num = Number(raw);

      if (isNaN(num)) return fallback;

      return { val: num, strVal: raw };
    };

    const getExpression = (
      type: PlotConfig["type"],
      params: PlotConfig["params"],
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
          addMessage(
            "Error: Expression generation for this type not implemented.",
          );
          return "Error";
      }
    };

    switch (cmd) {
      case "quad": {
        quadFn(args, setPlots, addMessage, plots, getNum);
        break;
      }

      case "linear": {
        linearFn(args, setPlots, addMessage, plots, getNum);
        break;
      }

      case "sin":
      case "cos": {
        cosSinFn(args, setPlots, addMessage, plots, getNum, cmd);
        break;
      }

      case "update": {
        if (args.length < 3) {
          addMessage("Error: Insufficient arguments for 'update' command.");
          break;
        }

        const idToUpdate = args[0];
        const existingPlot = plots.find((p) => p.id === idToUpdate);

        if (!existingPlot) {
          addMessage(`Error: Plot '${idToUpdate}' not found.`);
          break;
        }

        // Nova função adaptada para lidar com os objetos
        const getUpdatedParam = (
          index: number,
          oldParam: { val: number; strVal: string },
        ) => {
          const arg = args[index];
          if (!arg || arg === "_") return oldParam;

          const parsed = getNum(index, oldParam.val);

          // Previne que entradas inválidas subscrevam a string bonita original
          if (
            parsed.strVal === oldParam.val.toString() &&
            arg !== oldParam.val.toString() &&
            isNaN(Number(arg))
          ) {
            return oldParam;
          }
          return parsed;
        };

        let updatedPlot: PlotConfig;

        if (existingPlot.type === "quad") {
          const old = existingPlot.params;
          const a = getUpdatedParam(1, old.a!);
          const b = getUpdatedParam(2, old.b!);
          const c = getUpdatedParam(3, old.c!);

          updatedPlot = createPlot(
            "quad",
            { a, b, c },
            idToUpdate,
            existingPlot.color,
          );
        } else if (existingPlot.type === "linear") {
          const old = existingPlot.params;
          const a = getUpdatedParam(1, old.a!);
          const b = getUpdatedParam(2, old.b!);

          updatedPlot = createPlot(
            "linear",
            { a, b },
            idToUpdate,
            existingPlot.color,
          );
        } else if (existingPlot.type === "sin" || existingPlot.type === "cos") {
          const old = existingPlot.params;
          const a = getUpdatedParam(1, old.a!);
          const b = getUpdatedParam(2, old.b!);
          const c = getUpdatedParam(3, old.c!);
          const d = getUpdatedParam(4, old.d!);

          updatedPlot = createPlot(
            existingPlot.type,
            { a, b, c, d },
            idToUpdate,
            existingPlot.color,
          );
        } else {
          addMessage(
            `Error: Update for ${existingPlot.type} doesn't exist yet.`,
          );
          break;
        }

        if (updatedPlot) {
          setPlots((prev) =>
            prev.map((plot) => (plot.id === idToUpdate ? updatedPlot : plot)),
          );
          addMessage(`plot '${idToUpdate}' updated.`);
        }
        break;
      }

      case "viewbox": {
        if (args.length < 4) {
          addMessage("Error: Insufficient arguments for 'viewbox' command.");
          return;
        }
        const xMin = Number(args[0]);
        const xMax = Number(args[1]);
        const yMin = Number(args[2]);
        const yMax = Number(args[3]);

        if (isNaN(xMin) || isNaN(xMax) || isNaN(yMin) || isNaN(yMax)) {
          addMessage("Error: Invalid arguments for 'viewbox' command.");
          return;
        }

        setSettings((prev) => ({
          ...prev,
          viewBox: { x: [xMin, xMax], y: [yMin, yMax] },
        }));
        addMessage(
          `ViewBox updated: X:[${xMin}, ${xMax}] Y:[${yMin}, ${yMax}]`,
        );
        break;
      }

      case "remove": {
        const idToRemove = args[0];
        if (!idToRemove) {
          addMessage("Error: Specify an ID to remove.");
          return;
        }
        setPlots((prev) => prev.filter((plot) => plot.id !== idToRemove));
        addMessage(`Plot '${idToRemove}' removed.`);
        break;
      }

      case "zoom": {
        const zoomValue =
          args[0] === "on" || args[0] === "off" ? args[0] : "off";
        setSettings((prev) => ({
          ...prev,
          zoom: zoomValue === "on",
        }));
        addMessage(`Zoom ${zoomValue}`);
        break;
      }

      case "clear": {
        setPlots([]);
        addMessage("Cartesian plane cleared.");
        break;
      }

      default:
        addMessage(`Error: Command '${cmd}' not recognized.`);
    }
  };

  return { processCommand };
}
