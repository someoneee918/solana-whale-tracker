import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const binPath = path.join(root, "bin", "whales.js");
const validMint = "So11111111111111111111111111111111111111112";

function run(args) {
  return spawnSync(process.execPath, [binPath, ...args], { encoding: "utf8" });
}

test("rejects invalid --limit values before network calls", () => {
  const r1 = run([validMint, "--limit", "-2"]);
  assert.equal(r1.status, 1);
  assert.match(r1.stderr, /--limit must be a whole number above 0/);

  const r2 = run([validMint, "--limit", "0"]);
  assert.equal(r2.status, 1);
  assert.match(r2.stderr, /--limit must be a whole number above 0/);

  const r3 = run([validMint, "--limit", "abc"]);
  assert.equal(r3.status, 1);
  assert.match(r3.stderr, /--limit must be a whole number above 0/);

  const r4 = run([validMint, "--limit"]);
  assert.equal(r4.status, 1);
  assert.match(r4.stderr, /--limit must be a whole number above 0/);
});

test("rejects invalid --min-usd values before network calls", () => {
  const r1 = run([validMint, "--min-usd", "abc"]);
  assert.equal(r1.status, 1);
  assert.match(r1.stderr, /--min-usd must be a number of 0 or more/);

  const r2 = run([validMint, "--min-usd", "-1"]);
  assert.equal(r2.status, 1);
  assert.match(r2.stderr, /--min-usd must be a number of 0 or more/);

  const r3 = run([validMint, "--min-usd", "5k"]);
  assert.equal(r3.status, 1);
  assert.match(r3.stderr, /--min-usd must be a number of 0 or more/);

  const r4 = run([validMint, "--min-usd"]);
  assert.equal(r4.status, 1);
  assert.match(r4.stderr, /--min-usd must be a number of 0 or more/);
});

test("rejects invalid --wallets values before network calls", () => {
  const r1 = run([validMint, "--wallets", "-1"]);
  assert.equal(r1.status, 1);
  assert.match(r1.stderr, /--wallets must be a whole number above 0/);

  const r2 = run([validMint, "--wallets", "0"]);
  assert.equal(r2.status, 1);
  assert.match(r2.stderr, /--wallets must be a whole number above 0/);

  const r3 = run([validMint, "--wallets", "xyz"]);
  assert.equal(r3.status, 1);
  assert.match(r3.stderr, /--wallets must be a whole number above 0/);
});
