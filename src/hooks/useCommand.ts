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
        if (args.length < 2) {
          addMessage("Error: Insufficient arguments for 'viewbox' command.");
          return;
        }
        const xMax = Number(args[0]);
        const yMax = Number(args[1]);

        if (isNaN(xMax) || isNaN(yMax) || xMax <= 0 || yMax <= 0) {
          addMessage("Error: Invalid arguments for 'viewbox' command.");
          return;
        }

        setSettings((prev) => ({
          ...prev,
          viewBox: { x: [-xMax, xMax], y: [-yMax, yMax] },
        }));
        addMessage(
          `ViewBox updated: X:[${-xMax}, ${xMax}] Y:[${-yMax}, ${yMax}]`,
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

      case "aspratio": {
        if (
          (args[0] !== "contain" && args[0] !== "false") ||
          args.length === 0
        ) {
          addMessage("Error: Invalid argument for 'aspratio' command.");
          return;
        }
        const aspValue = args[0] === "contain" ? "contain" : false;
        setSettings((prev) => ({
          ...prev,
          aspRatio: aspValue,
        }));
        addMessage(`Aspect Ratio set to ${aspValue}`);
        break;
      }

      case "pan": {
        if ((args[0] !== "true" && args[0] !== "false") || args.length === 0) {
          addMessage("Error: Invalid argument for 'pan' command.");
          return;
        }
        const panValue = args[0] === "true" ? true : false;
        setSettings((prev) => ({
          ...prev,
          pan: panValue,
        }));
        addMessage(`Panning set to ${panValue}`);
        break;
      }

      case "label": {
        if (args.length < 2) {
          addMessage("Error: Insufficient arguments for 'label' command.");
          break;
        }

        const [argX, argY] = args;

        const parseLabel = (val: string) =>
          val === "pi" ? Math.PI : Number(val);

        const valX = parseLabel(argX);
        const valY = parseLabel(argY);

        if (isNaN(valX) || valX <= 0 || isNaN(valY) || valY <= 0) {
          addMessage(
            "Error: Invalid arguments for 'label' command. Use numbers or 'pi'.",
          );
          break;
        }

        setSettings((prev) => ({
          ...prev,
          labelX: valX,
          labelY: valY,
        }));

        addMessage(`Labels updated: X: ${argX}, Y: ${argY}`);
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
