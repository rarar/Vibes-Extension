import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import serve from "rollup-plugin-serve";
import copy from "rollup-plugin-copy";
import { terser } from "rollup-plugin-terser";

const IS_PROD = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "./src/background.js",
    output: {
      name: "background",
      file: "./dist/background.js",
      format: "umd"
    },
    plugins: [
      copy({
        targets: [
          { src: ["client/index.html", "client/client.js", "client/styles.css", "client/vibes-16x16.png", "client/vibes-128x128.png", "client/vibes-48x48.png"], dest: "dist" }],
      }),
      json(),
      commonjs(),
      resolve(),
      !IS_PROD && serve({ contentBase: ["dist"], port: 5000 }),
      !IS_PROD && livereload({ watch: "dist" }),
      IS_PROD && terser(),
    ],
  },
];
