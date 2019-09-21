export const getPromiseTimer = (time, value) =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(value), time);
  });
