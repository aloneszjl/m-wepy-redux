import { getStore } from "./store";

export const mapState = state =>
  Object.keys(state).reduce(
    (nextState, key) => ({
      ...nextState,
      [key]: () => state[key]
    }),
    {}
  );

export const mapDispatch = mapDispatchToProps => {
  const dispatch = getStore().dispatch;
  const actionMap =
    typeof mapDispatchToProps === "function"
      ? mapDispatchToProps({ dispatch })
      : mapDispatchToProps;
  return Object.keys(actionMap).reduce(
    (nextActionMap, action) => ({
      ...nextActionMap,
      [action]: (...args) =>
        typeof actionMap[action] === "string"
          ? dispatch({ type: actionMap[action] })
          : dispatch(actionMap[action](...args))
    }),
    {}
  );
};
