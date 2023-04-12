import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import { string } from "rollup-plugin-string";

const tsToJsEntrypoints = ["touch"];

export default tsToJsEntrypoints.flatMap((name) => {
  const common = {
    input: `src/${name}.ts`,
    external: (id) => !/^[./]/.test(id),
  };

  return [
    {
      plugins: [
        esbuild(),
        string({
          include: `**/*.stringify.js`,
        }),
      ],
      output: [
        {
          file: `dist/${name}.js`,
          format: "cjs",
          sourcemap: true,
        },
        {
          file: `dist/${name}.mjs`,
          format: "es",
          sourcemap: true,
        },
      ],
      ...common,
    },
    {
      plugins: [dts()],
      output: {
        file: `dist/${name}.d.ts`,
        format: "es",
      },
      ...common,
    },
  ];
});
