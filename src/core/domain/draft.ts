/** The three texts written for a release. */
export interface Draft {
  /** For developers: short and technical. */
  readonly changelog: string;
  /** For end users: what is new and how to use it. */
  readonly guide: string;
  /** A short announcement of the release. */
  readonly message: string;
}
