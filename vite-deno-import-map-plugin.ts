import { resolve } from "https://deno.land/std@0.172.0/path/mod.ts";

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
  if (path.startsWith("npm:")) {
    return path;
  }

  if (path.startsWith("https:")) {
    return path;
  }

  if (path.startsWith("http:")) {
    return path;
  }

  const res = resolve(path);
  if (path.endsWith("/")) {
    return `${res}/`;
  } else {
    return res;
  }
}
