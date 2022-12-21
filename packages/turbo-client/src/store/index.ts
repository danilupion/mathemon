const store = (persistent = true) => {
  return persistent ? localStorage : sessionStorage;
};

export default store;
