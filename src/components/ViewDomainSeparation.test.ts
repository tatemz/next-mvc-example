import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { it } from "@effect/vitest";
import { describe, expect } from "vitest";

const filesUnder = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });

const viewModelFiles = ["src/components", "src/page-modules"]
  .flatMap(filesUnder)
  .filter((path) => !/\.test\.tsx?$/.test(path));

const domainImport =
  /import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+["'][^"']*\/domain\//g;
const allowedDomainImports = new Set([
  "Universe",
  "Universes",
  "NoTransportKey",
  "TransportKinds",
]);
const importedDomainNames = (source: string): string[] =>
  [...source.matchAll(domainImport)].flatMap((match) =>
    match[1]
      .split(",")
      .map((name) =>
        name.trim().replace(/^type\s+/, "").split(/\s+as\s+/)[0]
      )
      .filter((name) => name !== "")
  );
const viewModelImport = /from\s+["'][^"']*(components|page-modules)\//;

describe("view-model layer", () => {
  it("imports only the Universe domain values", () => {
    const importers = viewModelFiles.filter((path) =>
      importedDomainNames(readFileSync(path, "utf8")).some(
        (name) => !allowedDomainImports.has(name),
      )
    );

    expect(importers).toEqual([]);
  });

  it("keeps domain models independent of the view-model layer", () => {
    const importers = filesUnder("src/domain").filter((path) =>
      viewModelImport.test(readFileSync(path, "utf8"))
    );

    expect(importers).toEqual([]);
  });
});
