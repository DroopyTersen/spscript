import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import visualizer from "rollup-plugin-visualizer";
export default {
  input: "src/index.ts", // our source file
  output: [
    {
      file: "dist/spscript.browser.js",
      format: "iife",
      name: "SPScript", // the global which can be used in a browser
    },
  ],
  plugins: [
    typescript({
      typescript: require("typescript"),
      tsconfig: "tsconfig.json",
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
        },
      },
    }),
    terser(),
    visualizer({ title: "SPScript Bundle", open: false }),
  ],
};
