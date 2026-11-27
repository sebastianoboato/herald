#!/bin/sh
# Installs a packed Herald (.tgz) in an empty folder and checks that the command starts.
# Usage: npm run smoke-test -- herald-0.1.0.tgz
set -eu

package="${1:?usage: smoke-test.sh <herald-X.Y.Z.tgz>}"
package="$(realpath "$package")"

folder="$(mktemp -d)"
trap 'rm -rf "$folder"' EXIT

npm install --prefix "$folder" --no-audit --no-fund "$package"

output="$("$folder/node_modules/.bin/herald" --help)"
case "$output" in
  *"Usage: herald"*)
    echo "smoke test passed: the installed herald prints its usage" ;;
  *)
    echo "smoke test failed: the installed herald did not print its usage:" >&2
    echo "$output" >&2
    exit 1 ;;
esac
