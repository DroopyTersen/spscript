import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";
import visualizer from "rollup-plugin-visualizer";
export default {
  input: "src/index.ts", // our source file
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.browser,
      format: "iife",
      name: "SPScript", // the global which can be used in a browser
    },
    {
      file: pkg.module,
      format: "es", // the preferred format
    },
  ],
  plugins: [
    typescript({
      typescript: require("typescript"),
    }),
    terser(),
    visualizer({ title: "SPScript Bundle", open: true }),
  ],
};
