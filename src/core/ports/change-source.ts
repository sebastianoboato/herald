import type { ChangeSet } from "../domain/change-set.ts";

/** Driven port: what changed in a release. */
export interface ChangeSource {
  /** The changes that make up the release `tag`. */
  collect(tag: string): Promise<ChangeSet>;
}
