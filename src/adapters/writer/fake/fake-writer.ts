import type { Writer } from "../../../core/ports/writer.ts";

/**
 * Writes no real text: replies with the first line of the instructions it received,
 * and remembers every instruction so tests can inspect them.
 */
export class FakeWriter implements Writer {
  readonly instructions: string[] = [];

  async write(instructions: string): Promise<string> {
    this.instructions.push(instructions);
    const task = instructions.split("\n", 1)[0] ?? "";
    return `[fake writer] ${task}`;
  }
}
