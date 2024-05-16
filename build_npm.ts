import { build, emptyDir } from "https://deno.land/x/dnt@0.40.0/mod.ts";

const version = Deno.args[0];

if (!version) {
  console.log("Run this script with a version argument.")
  Deno.exit(1)
}

await emptyDir("./npm");
await build({
  entryPoints: ["./mod.ts"],
  packageManager: "pnpm",
  outDir: "./npm",
  compilerOptions: {
    target: "ES2022",
  },
  scriptModule: false,
  shims: {
    deno: true,
  },
  package: {
    name: "datefmt",
    version: version,
    description: "Golang-style date formatting with custom delimeters & UTC conversion.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/hedyhli/deno-datefmt.git",
    },
    bugs: {
      url: "https://github.com/hedyhli/deno-datefmt/issues",
    },
  },
  mappings: {},
  postBuild() {
    Deno.copyFileSync("LICENSE", "./npm/LICENSE");
    Deno.copyFileSync("README.md", "./npm/README.md");
  },
});
