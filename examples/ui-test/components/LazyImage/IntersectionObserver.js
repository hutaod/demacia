function throwError() {
  throw new Error("can not call on server side");
}

const server = {
  track: throwError,
};

export default (process.browser ? require("intersection-observer") : server);
