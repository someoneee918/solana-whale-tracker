import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const binPath = path.join(root, "bin", "whales.js");
const fixturePath = path.join(root, "test", "fixtures", "mock-fetch.mjs");
const mint = "So11111111111111111111111111111111111111112";

test("prints initial trades as JSON lines when --watch and --json are combined", async () => {
  const child = spawn(
    process.execPath,
    ["--import", fixturePath, binPath, mint, "--watch", "20", "--json"],
    { stdio: ["ignore", "pipe", "pipe"] }
  );

  const lines = [];
  child.stdout.setEncoding("utf8");

  await new Promise((resolve, reject) => {
    let buffer = "";
    child.stdout.on("data", (chunk) => {
      buffer += chunk;
      const parts = buffer.split("\n");
      buffer = parts.pop();
      for (const line of parts) {
        if (line.trim()) lines.push(line.trim());
      }
      if (lines.length >= 2) {
        child.kill();
        resolve();
      }
    });

    child.on("error", reject);
    child.on("exit", () => resolve());
    setTimeout(() => {
      child.kill();
      resolve();
    }, 4000);
  });

  assert.ok(lines.length >= 2, `Expected at least 2 JSON lines, got ${lines.length}`);
  const trade1 = JSON.parse(lines[0]);
  const trade2 = JSON.parse(lines[1]);

  assert.equal(trade1.id, "trade_1");
  assert.equal(trade1.side, "buy");
  assert.equal(trade1.usd, 2000);

  assert.equal(trade2.id, "trade_2");
  assert.equal(trade2.side, "sell");
  assert.equal(trade2.usd, 1000);
});
