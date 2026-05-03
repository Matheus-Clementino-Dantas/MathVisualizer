import { type Dispatch, type SetStateAction } from "react";
import { type PlotConfig, type Settings } from "../App";
import { quadFn } from "./useCommandFns/quadFn";
import { linearFn } from "./useCommandFns/linearFn";
import { cosSinFn } from "./useCommandFns/cosSinFn";
import { updateFn } from "./useCommandFns/updateFn";

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

    const plotFnParams = { args, setPlots, addMessage, plots, getNum };

    switch (cmd) {
      case "quad": {
        quadFn(plotFnParams);
        break;
      }

      case "linear": {
        linearFn(plotFnParams);
        break;
      }

      case "sin":
      case "cos": {
        cosSinFn(plotFnParams, cmd);
        break;
      }

      case "update": {
        updateFn(plotFnParams);
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
