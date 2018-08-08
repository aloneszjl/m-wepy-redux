let reduxStore = null;

export const getStore = () => reduxStore;

export const setStore = s => {
  reduxStore = s;
};
