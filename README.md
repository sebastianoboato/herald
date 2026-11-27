# Herald

Herald announces your releases and explains them to your users: when a release is tagged, it writes a changelog, a "What's new" guide and a short announcement, and publishes them.

**Status:** early development. `herald preview` runs end to end with fake data; nothing is read from git or sent to an LLM yet. Design: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Install

Requires Node 26 or later. Each release on GitHub has the package attached:

```
npm install -g https://github.com/sebastianoboato/herald/releases/download/vX.Y.Z/herald-X.Y.Z.tgz
```

Replace `X.Y.Z` with a version from the [Releases](https://github.com/sebastianoboato/herald/releases) page; the release description shows the file's sha256.

## Run it from source

You need git and Node 26 (the version is in `.nvmrc`). With [nvm](https://github.com/nvm-sh/nvm):

```
git clone https://github.com/sebastianoboato/herald.git
cd herald
nvm install           # installs and selects the Node version in .nvmrc
npm ci                # installs the dependencies recorded in package-lock.json
npm run setup-hooks   # turns on the pre-push hook; once per clone
```

No configuration or API key is needed yet: every adapter is a fake.

```
npm run herald -- preview v0.1.0
```

Expected output: three sections, `## Changelog`, `## Guide` and `## Message`, each starting with `[fake writer]`.

### Checks

| Command | What it runs |
|---|---|
| `npm run lint` | ESLint, including the rule that keeps `src/core` independent |
| `npm run typecheck` | TypeScript on sources and tests |
| `npm test` | Vitest |
| `npm run build` | compiles `src/` to `dist/` |
| `npm run release-check` | all four, in this order |

The pre-push hook runs lint, type check and build on every push, and the tests too when pushing `main`; a failure cancels the push.

## Release it

Releases are made by the **Release** workflow on GitHub, started by hand. It checks a clean install and packs Herald; only if everything passes does it tag the commit and create the GitHub Release with that package.

1. On `main`, set the new version (higher than the latest release):
   ```
   npm version X.Y.Z --no-git-tag-version   # updates package.json and package-lock.json; no commit, no tag
   ```
2. Commit both files as `Release X.Y.Z` and push `main`.
3. On GitHub: **Actions → Release → Run workflow**, branch `main`, untick **Dry run**, then **Run workflow**.
4. When both jobs are green, `vX.Y.Z` is on the Releases page. Get the tag locally with `git fetch --tags`.

With **Dry run** ticked (the default), or on a branch other than `main`, the workflow checks and packs but publishes nothing; the package can be downloaded from the run's page, under *Artifacts*.

### If something fails

- **Before publishing** (`verify` job red): nothing was created. Fix it like any other change, then run the workflow again with the same version.
- **While publishing** (`publish` job red): look at the Releases page. If the release is missing or has no package attached, nobody can have installed it: delete the release on GitHub and the tag with `git push origin --delete vX.Y.Z`, then run the workflow again.
- **After publishing** (a bad release): never move or reuse its tag. Fix it and release a higher version.
