/** What changed between two releases. */
export interface ChangeSet {
  readonly commits: readonly Commit[];
  readonly files: readonly ChangedFile[];
}

export interface Commit {
  readonly message: string;
  readonly author: string;
  /** ISO 8601 date and time. */
  readonly date: string;
}

export interface ChangedFile {
  readonly path: string;
  readonly status: FileStatus;
}

export type FileStatus = "added" | "modified" | "deleted" | "renamed";
