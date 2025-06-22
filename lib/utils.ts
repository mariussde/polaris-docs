import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EachRoute, ROUTES } from "./routes-config";
import { Dictionary } from "./dictionaries";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function helperSearch(
  query: string,
  dict: Dictionary,
  node: EachRoute,
  prefix: string,
  currenLevel: number,
  maxLevel?: number,
) {
  const res: EachRoute[] = [];
  let parentHas = false;

  const nextLink = `${prefix}${node.href}`;

  if (
    !node.noLink &&
    dict.leftbar[node.title as keyof typeof dict.leftbar]?.toLowerCase()
      .includes(query.toLowerCase())
  ) {
    res.push({ ...node, items: undefined, href: nextLink });
    parentHas = true;
  }
  const goNext = maxLevel ? currenLevel < maxLevel : true;
  if (goNext) {
    node.items?.forEach((item) => {
      const innerRes = helperSearch(
        query,
        dict,
        item,
        nextLink,
        currenLevel + 1,
        maxLevel,
      );
      if (!!innerRes.length && !parentHas && !node.noLink) {
        res.push({ ...node, items: undefined, href: nextLink });
        parentHas = true;
      }
      res.push(...innerRes);
    });
  }
  return res;
}

export function advanceSearch(query: string, dict: Dictionary) {
  return ROUTES.map((node) =>
    helperSearch(query, dict, node, "", 1, query.length == 0 ? 2 : undefined)
  ).flat();
}

// Thursday, May 23, 2024
export function formatDate(dateStr: string): string {
  const [day, month, year] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
}

//  May 23, 2024
export function formatDate2(dateStr: string): string {
  const [day, month, year] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function stringToDate(date: string) {
  const [day, month, year] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// https://devicon.dev/
//  icon format : <i class="devicon-go-plain"></i>
export const fileExtensionIconMap = {
  js: "javascript",
  jsx: "react",
  ts: "typescript",
  tsx: "react",
  py: "python",
  java: "java",
  cpp: "cplusplus",
  c: "c",
  cs: "csharp",
  php: "php",
  rb: "ruby",
  go: "go",
  rs: "rust",
  kt: "kotlin",
  swift: "swift",
  scala: "scala",
  r: "r",
  dart: "dart",
  lua: "lua",
  perl: "perl",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  html: "html5",
  css: "css3",
  scss: "sass",
  sass: "sass",
  less: "less",
  xml: "xml",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  toml: "toml",
  md: "markdown",
  mdx: "markdown",
  txt: "plain",
  sql: "mysql",
  graphql: "graphql",
  vue: "vuejs",
  svelte: "svelte",
  astro: "astro",
  prisma: "prisma",
  gitignore: "git",
};

export function hasSupportedExtension(name: string): boolean {
  const splittedNames = name.split(".");
  const ext = splittedNames[splittedNames.length - 1]?.toLowerCase();
  if (!ext) return false;
  return !!fileExtensionIconMap[ext as keyof typeof fileExtensionIconMap];
}

export function getIconName(name: string): string {
  const splittedNames = name.split(".");
  const ext = splittedNames[splittedNames.length - 1]?.toLowerCase();
  return fileExtensionIconMap[ext as keyof typeof fileExtensionIconMap] || "code";
}

export const getGitHubAvatarUrl = (username: string, size: number = 400): string => {
  return `https://avatars.githubusercontent.com/${username}?size=${size}`;
};
