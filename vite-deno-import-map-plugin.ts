import { resolve } from "node:path";

export type ImportMap = {
  imports?: Record<string, string>;
};

export function importMaps(options: ImportMap | (() => ImportMap)) {
  const importMap = (typeof options === "function") ? options() : options;

  return {
    name: "vite:deno-import-map-plugin",
    config() {
      const result = {
        resolve: {
          alias: {
            ...Object.keys(importMap.imports ?? []).reduce(
              (acc, imp) => ({
                ...acc,
                [imp]: resolvePath(`${importMap.imports![imp]}`),
              }),
              {},
            ),
          },
        },
      };
      return result;
    },
  };
}

function resolvePath(path: string) {
  if (isLocalImport(path)) {
    const res = resolve(path);
    if (path.endsWith("/")) {
      return `${res}/`;
    } else {
      return res;
    }
  } else {
    return path;
  }
}

function isLocalImport(path: string) {
  return ["./", "../"].some((it) => path.startsWith(it));
}
