import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Runs the real entry point as a separate process, the way a user or CI would.
const projectRoot = resolve(import.meta.dirname, "../..");

function herald(...args: string[]) {
  return spawnSync(process.execPath, ["src/cli/main.ts", ...args], { cwd: projectRoot, encoding: "utf8" });
}

describe("the herald entry point", () => {
  it("prints the preview and exits with 0", () => {
    const result = herald("preview", "v0.1.0");

    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("## Changelog");
  });

  it("exits with an error code on an unknown command", () => {
    const result = herald("publish-everything");

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Usage: herald");
  });
});
