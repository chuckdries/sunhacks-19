export const getTimer = (time, value) =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(value), time);
  });
