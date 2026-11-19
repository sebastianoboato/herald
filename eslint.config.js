import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

// Node modules that perform I/O. The core reaches the outside world only through ports.
const nodeIoModules = [
  "child_process",
  "dgram",
  "dns",
  "fs",
  "fs/promises",
  "http",
  "http2",
  "https",
  "net",
  "os",
  "readline",
  "tls",
];

export default defineConfig(
  { ignores: ["dist/", "coverage/"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    // Dependency rule (docs/ARCHITECTURE.md §3): cli -> core <- adapters.
    files: ["src/core/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "(^|/)(adapters|cli|config)(/|$)",
              message: "The core must not import adapters, cli or config (cli -> core <- adapters).",
            },
            {
              regex: `^(node:)?(${nodeIoModules.join("|")})$`,
              message: "The core must not perform I/O; define a port and implement it in an adapter.",
            },
          ],
        },
      ],
    },
  },
);
