#!/bin/sh
# Stops a release whose version is already tagged or not higher than the latest release.
# Compares the version in package.json with the local tags: run `git fetch --tags` first.
# Usage: npm run release-guard
set -eu

fail() {
  echo "release guard: $1" >&2
  exit 1
}

version="$(node -p "require('./package.json').version")"

echo "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+$' \
  || fail "version $version in package.json is not of the form X.Y.Z"

if git rev-parse -q --verify "refs/tags/v$version" >/dev/null; then
  fail "v$version is already released; raise the version in package.json"
fi

latest="$(git tag --list 'v[0-9]*' --sort=-v:refname | head -n 1)"
if [ -z "$latest" ]; then
  echo "release guard passed: v$version is the first release"
  exit 0
fi

highest="$(printf '%s\n' "${latest#v}" "$version" | sort -V | tail -n 1)"
[ "$highest" = "$version" ] \
  || fail "v$version is lower than the latest release $latest"

echo "release guard passed: v$version is higher than the latest release $latest"
