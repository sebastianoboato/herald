import type { ProductKnowledge } from "../domain/product-knowledge.ts";

/** Driven port: where Herald learns about the product. */
export interface ProductContext {
  load(): Promise<ProductKnowledge>;
}
