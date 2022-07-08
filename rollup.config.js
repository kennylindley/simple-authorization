import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  {
    external: ["prop-types", "react", "react-dom"],
    input: "src/index.js",
    output: [{ file: "index.js", format: "cjs" }],
    plugins: [nodeResolve(), commonjs({ include: [/node_modules/] }), babel({ exclude: "node_modules/**" })]
  }
];
