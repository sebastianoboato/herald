/**
 * Driven port: generic text generation, instructions in, text out.
 * The instructions are built by the core; adapters only transport them to a provider.
 */
export interface Writer {
  write(instructions: string): Promise<string>;
}
