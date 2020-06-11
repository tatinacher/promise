const state = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected"
};

class Promise {
  constructor(executor) {
    if (executor === undefined || typeof executor !== "function") {
      throw new Error("Should pass a function to constructor");
    }

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
    if (
      value &&
      typeof value === "object" &&
      typeof value.then === "function"
    ) {
      value.then(this.settle(state.FULFILLED), this.settle(state.FULFILLED));
      return;
    }

    this.state = state;
    this.value = value;
    this.chain.forEach(callback => this.tryResolve(callback));
  };

  tryResolve = thenParams => {
    if (this.state === state.PENDING) {
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
    return new Promise((resolve, reject) => {
      this.tryResolve({
        onFulfilled: onFulfilled,
        onRejection: onRejection,
        resolve: resolve,
        reject: reject
      });
    });
  };
}

module.exports = { Promise };
