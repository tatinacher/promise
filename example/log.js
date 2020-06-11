const { PromiseLog } = require("../PromiseLog");

const promiseLog = data => {
  return new PromiseLog((resolve, reject) => {
    if (data >= 0) {
      setTimeout(() => resolve(data), 1000);
    } else {
      reject("Number is less than zero");
    }
  }, "sqrt");
};

promiseLog(121)
  .then(
    res => {
      return Math.sqrt(res);
    },
    res => {
      return res;
    }
  )
  .then(
    res => {
      console.log(res);
    },
    res => {
      console.log(res);
    }
  );
