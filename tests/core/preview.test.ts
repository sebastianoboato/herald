import { describe, expect, it } from "vitest";
import { FakeChangeSource } from "../../src/adapters/changes/fake/fake-change-source.ts";
import { FakeProductContext } from "../../src/adapters/context/fake/fake-product-context.ts";
import { FakeWriter } from "../../src/adapters/writer/fake/fake-writer.ts";
import type { ChangeSet } from "../../src/core/domain/change-set.ts";
import { preview } from "../../src/core/usecases/preview.ts";

const twoCommits: ChangeSet = {
  commits: [
    { message: "Add CSV export to reports", author: "Ada", date: "2026-11-18T10:00:00Z" },
    { message: "Fix date format in the report header", author: "Ada", date: "2026-11-18T11:00:00Z" },
  ],
  files: [
    { path: "src/reports/export.ts", status: "added" },
    { path: "src/reports/header.ts", status: "modified" },
  ],
};

function setUp() {
  const changes = new FakeChangeSource(twoCommits);
  const context = new FakeProductContext({ description: "Acme Reports helps shops track their sales." });
  const writer = new FakeWriter();
  return { changes, context, writer, ports: { changes, context, writer } };
}

describe("preview", () => {
  it("produces a changelog, a guide and a message", async () => {
    const { ports } = setUp();

    const draft = await preview("v0.1.0", ports);

    expect(draft.changelog).not.toBe("");
    expect(draft.guide).not.toBe("");
    expect(draft.message).not.toBe("");
    expect(new Set([draft.changelog, draft.guide, draft.message]).size).toBe(3);
  });

  it("collects the changes for the requested tag", async () => {
    const { changes, ports } = setUp();

    await preview("v0.1.0", ports);

    expect(changes.requestedTags).toEqual(["v0.1.0"]);
  });

  it("asks the writer once per text, giving it the version, the changes and the product", async () => {
    const { writer, ports } = setUp();

    await preview("v0.1.0", ports);

    expect(writer.instructions).toHaveLength(3);
    for (const instructions of writer.instructions) {
      expect(instructions).toContain("v0.1.0");
      expect(instructions).toContain("Add CSV export to reports");
      expect(instructions).toContain("Fix date format in the report header");
      expect(instructions).toContain("src/reports/export.ts");
      expect(instructions).toContain("Acme Reports helps shops track their sales.");
    }
  });
});
