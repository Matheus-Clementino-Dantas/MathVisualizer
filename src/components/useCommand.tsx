import { type Dispatch, type SetStateAction } from "react";
import { type PlotConfig, type Settings } from "../App";

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
      if (!args[index]) return defaultVal;
      const num = Number(args[index]);
      return isNaN(num) ? defaultVal : num;
    };

    switch (cmd) {
      case "quad": {
        if (args.length < 4) {
          addMessage("Error: Insufficient arguments for 'quad' command.");
          break;
        }
        const a = getNum(0, 1);
        const b = getNum(1, 0);
        const c = getNum(2, 0);
        const id = args[3] || crypto.randomUUID();
        const color = args[4] || "";

        setPlots((prev) => [
          ...prev,
          {
            id,
            type: "quad",
            params: { a, b, c },
            mathFunction: (x) => a * x ** 2 + b * x + c,
            color,
            expression: `f(x) = ${a}x² ${b === 0 ? "" : `+ ${b}x`} ${c === 0 ? "" : `+ ${c}`}`,
          },
        ]);
        addMessage(`quad '${id}' plotted.`);
        break;
      }

      case "linear": {
        if (args.length < 3) {
          addMessage("Error: Insufficient arguments for 'linear' command.");
          break;
        }
        const a = getNum(0, 1);
        const b = getNum(1, 0);
        const id = args[2] || crypto.randomUUID();
        const color = args[3] || "";

        const newPlot: PlotConfig = {
          id,
          type: "linear",
          params: { a, b },
          mathFunction: (x) => a * x + b,
          color,
          expression: `f(x) = ${a}x ${b === 0 ? "" : `+ ${b}`}`,
        };
        setPlots((prev) => [...prev, newPlot]);
        addMessage(`Linear '${id}' plotted.`);
        break;
      }

      case "sin":
      case "cos": {
        if (args.length < 5) {
          addMessage(`Error: Insufficient arguments for '${cmd}' command.`);
          break;
        }
        const a = getNum(0, 1);
        const b = getNum(1, 1);
        const c = getNum(2, 0);
        const d = getNum(3, 0);
        const id = args[4] || crypto.randomUUID();
        const color = args[5] || "";

        const newPlot: PlotConfig = {
          id,
          type: cmd === "sin" ? "sin" : "cos",
          params: { a, b, c, d },
          mathFunction: (x) =>
            cmd === "sin"
              ? a * Math.sin(b * x + c) + d
              : a * Math.cos(b * x + c) + d,
          color,
          expression: `f(x) = ${a} * ${cmd}(${b}x ${c === 0 ? "" : `+ ${c}`}) ${d === 0 ? "" : `+ ${d}`}`,
        };
        setPlots((prev) => [...prev, newPlot]);
        addMessage(`Function ${cmd} '${id}' plotted.`);

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

        const getUpdatedNum = (index: number, oldVal: number) => {
          const arg = args[index];
          if (!arg || arg === "_") return oldVal;
          const num = Number(arg);
          return isNaN(num) ? oldVal : num;
        };

        let updatedPlot: PlotConfig;

        if (existingPlot.type === "quad") {
          const old = existingPlot.params;

          const a = getUpdatedNum(1, old.a);
          const b = getUpdatedNum(2, old.b);
          const c = getUpdatedNum(3, old.c || 0);

          updatedPlot = {
            ...existingPlot,
            params: { a, b, c },
            mathFunction: (x) => a * x ** 2 + b * x + c,
            expression: `f(x) = ${a}x² ${b === 0 ? "" : `+ ${b}x`} ${c === 0 ? "" : `+ ${c}`}`,
          };
        } else if (existingPlot.type === "linear") {
          const old = existingPlot.params;
          const a = getUpdatedNum(1, old.a);
          const b = getUpdatedNum(2, old.b);

          updatedPlot = {
            ...existingPlot,
            params: { a, b },
            mathFunction: (x) => a * x + b,
            expression: `f(x) = ${a}x ${b === 0 ? "" : `+ ${b}`}`,
          };
        } else if (existingPlot.type === "sin" || existingPlot.type === "cos") {
          const old = existingPlot.params;
          const a = getUpdatedNum(1, old.a);
          const b = getUpdatedNum(2, old.b);
          const c = getUpdatedNum(3, old.c || 0);
          const d = getUpdatedNum(4, old.d || 0);

          updatedPlot = {
            ...existingPlot,
            params: { a, b, c, d },
            mathFunction: (x) =>
              existingPlot.type === "sin"
                ? a * Math.sin(b * x + c) + d
                : a * Math.cos(b * x + c) + d,
            expression: `f(x) = ${a} * ${cmd}(${b}x ${c === 0 ? "" : `+ ${c}`}) ${d === 0 ? "" : `+ ${d}`}`,
          };
        } else {
          addMessage(
            `Error: Update for ${existingPlot.type} doesn't exist yet.`,
          );
          break;
        }
        setPlots((prev) =>
          prev.map((plot) => (plot.id === idToUpdate ? updatedPlot : plot)),
        );
        addMessage(`plot '${idToUpdate}' updated.`);
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
        const zoomValue = args[0] || "on";
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
