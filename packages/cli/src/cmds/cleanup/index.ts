import { execSync } from "node:child_process";
import type { Command } from "commander";

export function registerClean(program: Command) {
  program
    .command("clean")
    .description("Remove build artifacts, logs, tgz, node_modules, rush/temp caches")
    .option("-f, --force", "skip confirmation")
    .addHelpText("after", `
Examples:
  $ @lytos clean
  $ @lytos clean --force
`)
    .action((opts: { force?: boolean }) => {
      const cmds = [
        "rm -rf common/deploy",
        "rm -rf common/temp",
        "rm -rf .*.log",
        "rm -rf *.log",
        "rm -rf *.tgz",
        `find . -name ".rush" -type d -prune -exec rm -rf '{}' +`,
        `find . -name "node_modules" -type d -prune -exec rm -rf '{}' +`
      ];

      if (!opts.force) {
        console.log("⚠️  This will delete node_modules, logs, caches, tgz…");
        console.log("Run with --force to skip confirmation.");
        return;
      }

      for (const c of cmds) {
        try {
          console.log("🧹", c);
          execSync(c, { stdio: "inherit" });
        } catch (e) {
          console.error("Failed:", c, e);
        }
      }

      console.log("✅ Clean complete.");
    });
}
