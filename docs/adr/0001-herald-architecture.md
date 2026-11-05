# 0001. Herald architecture

Date: 2026-11-05
Status: accepted

## Context
Herald must announce every release automatically, without anyone having to remember, and the same operations must be available by hand. Constraints: one developer, zero budget, a few releases per month. Herald depends on external services that may change or be replaced: git and GitHub, an LLM provider with free-tier limits, publication channels. The LLM output cannot be fully verified automatically, and a run can crash after a channel accepted a text but before Herald recorded it.

Alternatives discarded before implementation:
- event-driven workers with a queue: too much machinery for low volume and one developer;
- a server (Cloudflare Worker with webhook, queue and database): infrastructure to host and secure, with no benefit at this volume. Latency is not the deciding factor: the LLM call dominates the duration of a run.

## Decision
Herald is a single CLI with a hexagonal architecture.

1. **Ports and adapters.** The core (domain, use cases, rules, prompts) defines ports for everything external: `ChangeSource`, `ProductContext`, `Writer`, `Publisher` (one per channel), `Ledger`. Adapters implement them; every port has a fake adapter for tests. Configuration is read only by the composition root. Dependencies point inward: `cli -> core <- adapters`.
2. **CLI invoked by GitHub Actions, no server.** A workflow triggered by version tags installs and calls `herald`; it contains no logic. The same commands run on a developer machine.
3. **State in the repository.** The process keeps nothing between runs. Release and delivery state lives in `.herald/ledger.json`, committed to the default branch by Herald.
4. **Automatic approval gated by deterministic checks.** The release lifecycle keeps an explicit approval step (`prepared -> approved -> published`, or `blocked`). With the `auto` policy a release is approved only if all checks pass: version cited, documentation links exist, channel length limits respected, no empty section. A `manual` policy can be added later.
5. **Idempotent, correctable channels first.** The first channels are the GitHub release for the tag (created or updated) and the guide file at a fixed path in the documentation folder. Non-idempotent channels (chat, email) arrive later, together with manual approval and an at-most-once strategy.

Flows, ledger mechanics and failure handling are described in `../ARCHITECTURE.md`. Later architectural decisions are recorded as new ADRs in this folder; an accepted ADR is not edited but superseded.

## Consequences
+ Changing the LLM provider or adding a channel touches one adapter; the core is testable with fakes, without network.
+ No infrastructure to host, pay for or secure; identical behaviour locally and in CI.
+ State is versioned, auditable and travels with the code; no external database.
+ Releases are announced without human work, and re-running a failed release is safe because the first channels are idempotent; published mistakes can be corrected.
- More interfaces and wiring than a direct implementation; port boundaries must stay honest (no provider details in the core).
- Automatic runs are tied to GitHub; approval from a chat channel, or projects outside GitHub, would require a server.
- Herald commits to the default branch; branch protection on that branch would block its push.
- Content that passes the checks but is wrong or misleading reaches users: the guarantee is "published only if it passes the automatic checks", not "published after human review".
- No push notification to users in the first increments.

## Revisit if
- ports end up with a single adapter each and no tests use the fakes;
- projects outside GitHub must be supported, or approval must happen outside the terminal and GitHub;
- the ledger becomes hard to manage, or commits by Herald become unacceptable for users;
- after 5 releases, more than one published guide needed significant corrections;
- a non-idempotent channel becomes necessary before manual approval exists.
