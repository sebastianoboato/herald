import { resolve } from "node:path";
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

// The dependency rule (cli -> core <- adapters) is enforced by lint. These tests check that the
// lint configuration actually rejects forbidden imports, so the rule cannot silently stop working.
const eslint = new ESLint({ cwd: resolve(import.meta.dirname, "../..") });

async function restrictedImportErrors(filePath: string, specifier: string): Promise<number> {
  const code = `import { something } from "${specifier}";\nexport { something };\n`;
  const [result] = await eslint.lintText(code, { filePath });
  return result?.messages.filter((message) => message.ruleId === "no-restricted-imports").length ?? 0;
}

describe("dependency rule", () => {
  it.each([
    "../../adapters/writer/fake/fake-writer.ts",
    "../../cli/run.ts",
    "../../config/composition-root.ts",
  ])("rejects a core import of %s", async (specifier) => {
    expect(await restrictedImportErrors("src/core/usecases/example.ts", specifier)).toBe(1);
  });

  it.each(["fs", "node:fs", "node:fs/promises", "child_process", "node:child_process", "node:https"])(
    "rejects a core import of the I/O module %s",
    async (specifier) => {
      expect(await restrictedImportErrors("src/core/usecases/example.ts", specifier)).toBe(1);
    },
  );

  it("allows the core to import from the core", async () => {
    expect(await restrictedImportErrors("src/core/usecases/example.ts", "../domain/draft.ts")).toBe(0);
  });

  it("allows an adapter to import the core and do I/O", async () => {
    const adapter = "src/adapters/context/files/example.ts";

    expect(await restrictedImportErrors(adapter, "../../../core/ports/product-context.ts")).toBe(0);
    expect(await restrictedImportErrors(adapter, "node:fs/promises")).toBe(0);
  });
});
