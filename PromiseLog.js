const state = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected"
};

class PromiseLog {
  constructor(executor, name) {
    if (executor === undefined || typeof executor !== "function") {
      throw new Error("Should pass a function to constructor");
    }

    this.index = 0;
    this.name = name;
    this.state = state.PENDING;
    this.value;
    this.chain = [];

    try {
      executor(this.settle(state.FULFILLED), this.settle(state.REJECTED));
    } catch (error) {
      this.settle(state.REJECTED);
    }
  }

  settle = state => value => {
    console.log(
      "*",
      this.name,
      ": settle with state",
      state,
      " and value",
      value
    );

    if (
      value &&
      typeof value === "object" &&
      typeof value.then === "function"
    ) {
      console.log("* got promise as a value");

      value.then(this.settle(state.FULFILLED), this.settle(state.FULFILLED));
      return;
    }

    this.state = state;
    this.value = value;
    this.chain.forEach(callback => this.tryResolve(callback));
  };

  tryResolve = thenParams => {
    if (this.state === state.PENDING) {
      console.log("*", this.name, ": is pending, adding next then to chain");
      this.chain.push(thenParams);
      return;
    }

    let thenResult;
    const [thenFunction, promiseFunction] =
      this.state === state.FULFILLED
        ? [thenParams.onFulfilled, thenParams.resolve]
        : [thenParams.onRejection, thenParams.reject];

    try {
      thenResult = thenFunction(this.value);
    } catch (error) {
      thenResult = thenFunction(error);
    } finally {
      promiseFunction(thenResult);
    }
  };

  then = (onFulfilled, onRejection) => {
    console.log("*", this.name, ": then");
    this.index += 1;

    return new PromiseLog((resolve, reject) => {
      this.tryResolve({
        onFulfilled: onFulfilled,
        onRejection: onRejection,
        resolve: resolve,
        reject: reject
      });
    }, this.name + " then " + this.index);
  };
}

module.exports = { PromiseLog };
