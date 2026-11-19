import { parseArgs } from "node:util";
import { createPreviewPorts } from "../config/composition-root.ts";
import type { Draft } from "../core/domain/draft.ts";
import { preview, type PreviewPorts } from "../core/usecases/preview.ts";

export interface Output {
  out(text: string): void;
  err(text: string): void;
}

const EXIT_OK = 0;
const EXIT_USAGE = 2;

const usage = `Usage: herald <command> [options]

Commands:
  preview <tag>   Write the changelog, guide and message for <tag> and print them.
                  Publishes nothing and records nothing.

Options:
  -h, --help      Show this help.
`;

/** Runs one herald command and returns its exit code. */
export async function run(
  argv: readonly string[],
  output: Output,
  createPorts: () => PreviewPorts = createPreviewPorts,
): Promise<number> {
  let parsed;
  try {
    parsed = parseArgs({
      args: [...argv],
      allowPositionals: true,
      options: { help: { type: "boolean", short: "h" } },
    });
  } catch (error) {
    return usageError(output, error instanceof Error ? error.message : String(error));
  }

  if (parsed.values.help) {
    output.out(usage);
    return EXIT_OK;
  }

  const [command, ...args] = parsed.positionals;
  switch (command) {
    case "preview": {
      const [tag, ...extra] = args;
      if (tag === undefined || extra.length > 0) {
        return usageError(output, "preview needs exactly one tag, for example: herald preview v1.3.0");
      }
      const draft = await preview(tag, createPorts());
      output.out(formatDraft(draft));
      return EXIT_OK;
    }
    case undefined:
      return usageError(output, "Missing command.");
    default:
      return usageError(output, `Unknown command: ${command}`);
  }
}

function usageError(output: Output, problem: string): number {
  output.err(`${problem}\n\n${usage}`);
  return EXIT_USAGE;
}

function formatDraft(draft: Draft): string {
  const sections: [string, string][] = [
    ["Changelog", draft.changelog],
    ["Guide", draft.guide],
    ["Message", draft.message],
  ];
  return sections.map(([heading, text]) => `## ${heading}\n\n${text}\n`).join("\n");
}
