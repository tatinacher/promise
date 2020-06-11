const { Promise } = require("./");

test("Promise reject", done => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        reject(4);
      }, 1000);
    } catch (error) {
      done(error);
    }
  }).then(
    data => {
      expect(data).toBe(4);
    },
    data => {
      expect(data).toBe(4);
      done();
      return data;
    }
  );
});

test("asynchronous", () => {
  const p = new Promise((resolve, reject) => {
    resolve(5);
  });
  expect(p.result).not.toBe(5);
});

test(" Pig resolve", () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(4);
    }, 3000);
  }).then(data => {
    expect(data).toBe(4);
  });
});
