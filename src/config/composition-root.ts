import { FakeChangeSource } from "../adapters/changes/fake/fake-change-source.ts";
import { FakeProductContext } from "../adapters/context/fake/fake-product-context.ts";
import { FakeWriter } from "../adapters/writer/fake/fake-writer.ts";
import type { PreviewPorts } from "../core/usecases/preview.ts";

/**
 * Builds the adapters and hands them to the core.
 * Walking skeleton: every port is wired to its fake; real adapters replace them one issue at a time.
 */
export function createPreviewPorts(): PreviewPorts {
  return {
    changes: new FakeChangeSource(),
    context: new FakeProductContext(),
    writer: new FakeWriter(),
  };
}
