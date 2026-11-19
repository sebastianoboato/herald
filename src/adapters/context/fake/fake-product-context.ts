import type { ProductKnowledge } from "../../../core/domain/product-knowledge.ts";
import type { ProductContext } from "../../../core/ports/product-context.ts";

export const sampleProductKnowledge: ProductKnowledge = {
  description: "Sample Reports is a web app that helps small shops track their sales.",
};

/** Returns fixed product knowledge. */
export class FakeProductContext implements ProductContext {
  readonly #knowledge: ProductKnowledge;

  constructor(knowledge: ProductKnowledge = sampleProductKnowledge) {
    this.#knowledge = knowledge;
  }

  async load(): Promise<ProductKnowledge> {
    return this.#knowledge;
  }
}
