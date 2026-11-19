import type { ChangeSet } from "../domain/change-set.ts";
import type { ProductKnowledge } from "../domain/product-knowledge.ts";

export type TextKind = "changelog" | "guide" | "message";

// Placeholder instructions for the walking skeleton. The real prompts are written and
// versioned together with the first real Writer adapter.
const tasks: Record<TextKind, string> = {
  changelog: "Write the changelog for developers: short and technical.",
  guide: "Write a \"What's new\" guide for end users: what is new and how to use it, step by step.",
  message: "Write a short message announcing the release.",
};

export function instructionsFor(
  kind: TextKind,
  tag: string,
  changes: ChangeSet,
  product: ProductKnowledge,
): string {
  return [
    `${tasks[kind]} Release: ${tag}.`,
    "",
    "Product:",
    product.description,
    "",
    "Commits:",
    ...changes.commits.map((commit) => `- ${commit.message}`),
    "",
    "Changed files:",
    ...changes.files.map((file) => `- ${file.path} (${file.status})`),
  ].join("\n");
}
