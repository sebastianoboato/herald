/** What Herald knows about the product, so its texts fit what users already know. */
export interface ProductKnowledge {
  /** The product description written by the developer (`.herald/context.md`). */
  readonly description: string;
}
