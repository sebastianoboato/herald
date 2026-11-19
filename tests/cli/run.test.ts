import { describe, expect, it } from "vitest";
import { run, type Output } from "../../src/cli/run.ts";

function captureOutput() {
  const captured = { out: "", err: "" };
  const output: Output = {
    out: (text) => {
      captured.out += text;
    },
    err: (text) => {
      captured.err += text;
    },
  };
  return { output, captured };
}

describe("herald preview", () => {
  it("prints the changelog, the guide and the message under headings", async () => {
    const { output, captured } = captureOutput();

    const exitCode = await run(["preview", "v0.1.0"], output);

    expect(exitCode).toBe(0);
    expect(captured.out).toMatch(/## Changelog\n[\s\S]+## Guide\n[\s\S]+## Message\n/);
    expect(captured.out).toContain("v0.1.0");
    expect(captured.err).toBe("");
  });

  it("fails with usage when the tag is missing", async () => {
    const { output, captured } = captureOutput();

    const exitCode = await run(["preview"], output);

    expect(exitCode).toBe(2);
    expect(captured.err).toContain("Usage: herald");
  });
});

describe("herald with a wrong or missing command", () => {
  it.each([[["publish-everything"]], [[]], [["--verbose"]]])(
    "prints usage and exits with an error code for %j",
    async (argv) => {
      const { output, captured } = captureOutput();

      const exitCode = await run(argv, output);

      expect(exitCode).toBe(2);
      expect(captured.err).toContain("Usage: herald");
      expect(captured.out).toBe("");
    },
  );

  it("prints usage and succeeds with --help", async () => {
    const { output, captured } = captureOutput();

    const exitCode = await run(["--help"], output);

    expect(exitCode).toBe(0);
    expect(captured.out).toContain("Usage: herald");
  });
});
