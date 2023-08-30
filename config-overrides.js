const WorkerPlugin = require("worker-plugin");
const MonacoEditorWebpackPlugin = require("monaco-editor-webpack-plugin");
const WasmSdkPlugin = require("@0x33.io/wasm-sdk-webpack-plugin");
const {
  useBabelRc,
  override,
  overrideDevServer,
  watchAll,
} = require("customize-cra");
const CopyPlugin = require("copy-webpack-plugin");

const registerBabelRc = useBabelRc;

function setupWorkers() {
  return function (config, env) {
    //do stuff with the webpack config...
    if (!config.plugins) {
      config.plugins = [];
    }

    config.plugins.unshift(
      new WorkerPlugin({
        // disable warnings about "window" breaking HMR:
        globalObject: "this",
      })
    );

    config.plugins.push(
      new WasmSdkPlugin({
        destination: process.env.REACT_APP_WASM_RUNTIME_DIRECTORY,
        root: ".",
        moduleDirectories: config.resolve.modules,
      })
    );

    config.plugins.push(
      new MonacoEditorWebpackPlugin({
        languages: ["csharp"],
      })
    );

    const vsDirectories = [
      { from: "node_modules/monaco-editor/min/vs/", to: "vs" },
    ];
    if (process.env.NODE_ENV !== "production") {
      vsDirectories.push({
        from: "node_modules/monaco-editor/min-maps/vs/",
        to: "min-maps/vs",
      });
    }

    config.plugins.push(
      new CopyPlugin({
        patterns: vsDirectories,
      })
    );

    // throw JSON.stringify(config);
    config.output.globalObject = "self";

    return config;
  };
}

// can use this at some point
// function setupDevServer() {
//   return function (config, env) {
//     config.stats = "minimal";
//     config.hot = false;
//     config.watchOptions = config.watchOptions || {};
//     config.watchOptions.watch = true;
//     config.watchOptions.followSymlinks = true;
//     config.ignored = null;

//     console.log(config.watchOptions);

//     return config;
//   };
// }

module.exports = {
  webpack: override(registerBabelRc(), setupWorkers()),
  output: function (config, env) {
    return {
      ...config,
      globalObject: "this",
    };
  },
  devServer: overrideDevServer(watchAll()), // setupDevServer()
};
