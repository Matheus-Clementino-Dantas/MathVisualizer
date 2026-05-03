import { type plotFnParams } from "../../types/types";
import { createPlot } from "../useCommandUtils/createPlot";

export function updateFn({
  args,
  setPlots,
  addMessage,
  plots,
  getNum,
}: plotFnParams) {
  if (args.length < 3) {
    addMessage("Error: Insufficient arguments for 'update' command.");
    return;
  }

  const idToUpdate = args[0];
  const existingPlot = plots.find((p) => p.id === idToUpdate);

  if (!existingPlot) {
    addMessage(`Error: Plot '${idToUpdate}' not found.`);
    return;
  }

  const resolveParam = (
    index: number,
    oldParam?: { val: number; strVal: string },
  ) => {
    if (!oldParam) return { val: 0, strVal: "0" };

    const arg = args[index];

    if (!arg || arg === "_") return oldParam;

    const parsed = getNum(index, oldParam.val);

    const isInvalidInput =
      parsed.strVal === oldParam.val.toString() &&
      arg !== oldParam.val.toString();

    if (isInvalidInput) {
      return oldParam;
    }

    return parsed;
  };

  const old = existingPlot.params;

  const newParams = {
    a: resolveParam(1, old.a),
    b: resolveParam(2, old.b),
    c: resolveParam(3, old.c),
    d: resolveParam(4, old.d),
  };

  const updatedPlot = createPlot(
    existingPlot.type,
    newParams,
    idToUpdate,
    existingPlot.color,
    addMessage,
  );

  if (!updatedPlot) return;

  setPlots((prev) =>
    prev.map((plot) => (plot.id === idToUpdate ? updatedPlot : plot)),
  );

  addMessage(`Plot '${idToUpdate}' updated.`);
}
