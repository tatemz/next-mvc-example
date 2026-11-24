import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const filesUnder = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });

const viewModelFiles = ["src/components", "src/page-modules"]
  .flatMap(filesUnder)
  .filter((path) => /\.(model|factory|view)\.tsx?$/.test(path));

const domainImport = /from\s+["'][^"']*\/domain\//;
const viewModelImport = /from\s+["'][^"']*(components|page-modules)\//;

describe("view-model layer", () => {
  it("does not import domain models", () => {
    const importers = viewModelFiles.filter((path) =>
      domainImport.test(readFileSync(path, "utf8")),
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
