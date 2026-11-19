import type { Draft } from "../domain/draft.ts";
import type { ChangeSource } from "../ports/change-source.ts";
import type { ProductContext } from "../ports/product-context.ts";
import type { Writer } from "../ports/writer.ts";
import { instructionsFor, type TextKind } from "../prompts/instructions.ts";

export interface PreviewPorts {
  readonly changes: ChangeSource;
  readonly context: ProductContext;
  readonly writer: Writer;
}

/** Writes the three texts for a release without publishing anything or recording state. */
export async function preview(tag: string, ports: PreviewPorts): Promise<Draft> {
  const changes = await ports.changes.collect(tag);
  const product = await ports.context.load();

  // One writer call per text (decision of 2026-11-19); switch to a single call
  // if real provider limits make three calls impractical (ARCHITECTURE.md §15, question 2).
  const write = (kind: TextKind) => ports.writer.write(instructionsFor(kind, tag, changes, product));

  return {
    changelog: await write("changelog"),
    guide: await write("guide"),
    message: await write("message"),
  };
}
