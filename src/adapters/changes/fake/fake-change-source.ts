import type { ChangeSet } from "../../../core/domain/change-set.ts";
import type { ChangeSource } from "../../../core/ports/change-source.ts";

export const sampleChangeSet: ChangeSet = {
  commits: [
    { message: "Add CSV export to the sales report", author: "Sample Author", date: "2026-11-18T10:00:00Z" },
    { message: "Fix the date format in the report header", author: "Sample Author", date: "2026-11-18T11:30:00Z" },
  ],
  files: [
    { path: "src/reports/export.ts", status: "added" },
    { path: "src/reports/header.ts", status: "modified" },
  ],
};

/** Returns a fixed change set and remembers which tags were requested. */
export class FakeChangeSource implements ChangeSource {
  readonly requestedTags: string[] = [];
  readonly #changeSet: ChangeSet;

  constructor(changeSet: ChangeSet = sampleChangeSet) {
    this.#changeSet = changeSet;
  }

  async collect(tag: string): Promise<ChangeSet> {
    this.requestedTags.push(tag);
    return this.#changeSet;
  }
}
