#!/usr/bin/env node

// Forward execution to main CLI logic
import("../src/index.js").catch((err) => {
  console.error("❌ Fatal CLI Error:", err);
  process.exit(1);
});