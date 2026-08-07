function isTruthy(value) {
  // "unknown" è il default esplicito delle global non ancora risposte: deve restare falsy
  return value !== undefined && value !== null && value !== false && value !== "unknown";
}

function evaluateCondition(condition, state) {
  if (typeof condition === "string") return isTruthy(state[condition]);

  if (condition.all) return condition.all.every((c) => evaluateCondition(c, state));
  if (condition.any) return condition.any.some((c) => evaluateCondition(c, state));
  if (condition.not) return !evaluateCondition(condition.not, state);

  if (condition.eq) {
    const [key, value] = condition.eq;
    return state[key] === value;
  }

  if (condition.gt) {
    const [key, value] = condition.gt;
    return (state[key] ?? 0) > value;
  }

  throw new Error(`condizione non riconosciuta: ${JSON.stringify(condition)}`);
}

function foldEvents(events) {
  const state = {};
  for (const event of events) {
    Object.assign(state, event.writes);
  }
  return state;
}

function computeFrontier(nodes, state, doneIds) {
  return nodes.filter((node) => !doneIds.has(node.id) && evaluateCondition(node.condition, state));
}

export { evaluateCondition, foldEvents, computeFrontier };
