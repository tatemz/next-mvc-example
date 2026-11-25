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

const universeTypeImport =
  /import\s+type\s+\{[^}]*\bUniverse\b[^}]*\}\s+from\s+["'][^"']*\/domain\/FilmUniverse\.model["'];?\n?/g;
const domainImport = /from\s+["'][^"']*\/domain\//;
const withoutUniverseTypeImport = (source: string) =>
  source.replace(universeTypeImport, "");
const viewModelImport = /from\s+["'][^"']*(components|page-modules)\//;

describe("view-model layer", () => {
  it("does not import domain models other than the Universe type", () => {
    const importers = viewModelFiles.filter((path) =>
      domainImport.test(
        withoutUniverseTypeImport(readFileSync(path, "utf8")),
      ),
    );

    expect(importers).toEqual([]);
  });

  it("keeps domain models independent of the view-model layer", () => {
    const importers = filesUnder("src/domain").filter((path) =>
      viewModelImport.test(readFileSync(path, "utf8")),
    );

    expect(importers).toEqual([]);
  });
});
