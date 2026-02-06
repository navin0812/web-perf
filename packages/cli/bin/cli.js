#!/usr/bin/env node

// This is the CLI entry point that runs the TypeScript compiled code
import("../dist/cli.js").catch((error) => {
  console.error("Failed to load CLI:", error);
  process.exit(1);
});
