import type { Command } from "commander";
import { runPnpm } from "../../lib/exec.js";
import { addCatalogSpec } from "../../lib/catalogs.js";

export function registerAdd(program: Command) {
  program
    .command("add")
    .argument("<dep>", "dependency name")
    .argument("<workspace>", "workspace name (e.g. web, rest)")
    .option("-D, --dev", "save as devDependency")
    .option("-n, --name <catalog>", "named catalog (pnpm catalog key)")
    .description("Sugar for `install <dep> <workspace>` with catalogs.")
    .addHelpText("after", `
Examples:
  # Add a runtime dep
  $ @lytos add axios rest

  # Add a devDependency
  $ @lytos add vitest admin -D

  # Add using named catalog
  $ @lytos add react web -n testing
`)
    .action(async (dep: string, ws: string, opts: { dev: boolean, name: string }) => {
      await addCatalogSpec(ws, dep, { dev: !!opts?.dev, name: opts?.name });
      await runPnpm(["install", "-w"]);
      console.log(`✅ ${dep} added to ${ws}${opts?.name ? ` (catalog:${opts.name})` : " (catalog:)"}`);
    });
}
