# Herald — instructions for Claude Code

Herald announces releases and explains them to users. Read `docs/ARCHITECTURE.md` and `docs/adr/` before changing code.

## Architecture rules
- Hexagonal architecture: `cli -> core <- adapters`. The core never imports from `adapters/` or `cli/`.
- Every port has a fake adapter; core tests use fakes only.
- No business logic in workflow YAML: workflows in target repositories only install and call `herald`; Herald's own release workflow runs its checks through npm scripts, so they can be run locally too.
- Configuration is read only by the composition root.
- Everything in English: names, commands, messages, documentation.
- Open questions in `docs/ARCHITECTURE.md` §15 are decided during development, once working code gives evidence. Do not settle them in advance; raise them when the related code is being written.

## Workflow rules
- One issue in progress at a time; a short-lived branch per issue; `main` is always releasable.
- Each issue describes the feature only: goal, Given/When/Then scenarios, and scope (in/out). Issues do not mention claims; links between work and claims live in `docs/course/`.
- The pre-push hook (`.githooks/pre-push`) runs lint, type check and build before every push, and the tests too when pushing `main`; nothing is pushed unless they pass. Before merging: the branch diff reread. Releases only through the Release workflow on `main` (README, "Release it"); it creates the tag, never by hand.
- Git hooks are tested on a throwaway copy of the project: a new repository in a temporary folder, with a local folder as fake remote, one push per case, then the folder is deleted. Never by committing or pushing in this repository.
- Branch names start with the issue number (`N-short-name`). Commit messages don't reference the issue; the issue is closed by hand after the merge is pushed.

## Course tracking
This repository is also a course portfolio. The tracking files in `docs/course/` are private (git-ignored) until shared with the instructor. After significant work:
- **Decision about product, scope, process or architecture** → add a row to `docs/course/decisions.md` with the evidence that moved it. A change to the architecture also gets a new ADR in `docs/adr/` (an accepted ADR is superseded, not edited).
- **AI-assisted work** (including your own sessions) → propose an entry for `docs/course/ai-usage.md`: intent, boundary, verification, learning. The user confirms it.
- **New evidence about a claim** → update `docs/course/claims.md`.
- **An issue moves through the lifecycle** → record its times in `docs/course/lifecycle.md` when they happen, not afterwards.
- Label statements as **observed**, **proposed** or **unknown**. Never present a proposal as an observation.

## Course material
Slides of the Development Methodology course are in `course/slides/` (not versioned). Read them when a task concerns the lifecycle, claims, checkpoints or the portfolio. Do not copy their content into versioned files beyond short references.
