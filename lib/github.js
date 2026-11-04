import { USER, REVALIDATE_SECONDS, notes, fallbackNames } from "./manuscripts";

const dateFormat = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Bogota",
});

const TOOLS = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "NestJS",
  "Express",
  "FastAPI",
  "Python",
  "PostgreSQL",
  "Supabase",
  "Prisma",
  "Docker",
  "Django",
  "HTML",
  "CSS",
];

async function readResponse(url, accept) {
  const response = await fetch(url, {
    headers: {
      Accept: accept,
      "User-Agent": "TiancrisENP-portfolio",
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!response.ok) throw new Error(String(response.status));
  return response;
}

async function readJson(url) {
  const response = await readResponse(url, "application/vnd.github+json");
  return response.json();
}

async function readText(url, accept) {
  const response = await readResponse(url, accept);
  return response.text();
}

export function readPinnedNames(html, user = USER) {
  const start = html.indexOf("js-pinned-items-reorder-list");
  if (start < 0) return [];
  const end = html.indexOf("</ol>", start);
  const slice = html.slice(start, end === -1 ? undefined : end);
  const pattern = new RegExp(`href="/${user}/([^"#?]+)"`, "g");
  const names = [];

  for (const item of slice.split("js-pinned-item-list-item").slice(1)) {
    const match = pattern.exec(item);
    pattern.lastIndex = 0;
    if (!match) continue;
    const name = decodeURIComponent(match[1]);
    if (!names.includes(name)) names.push(name);
  }

  return names.slice(0, 6);
}

function titleFromName(name) {
  if (!/[-_]/.test(name)) return name;
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function plainText(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function firstParagraph(markdown) {
  const chunks = [];
  let buffer = [];

  const flush = () => {
    const text = plainText(buffer.join(" "));
    buffer = [];
    if (text.length > 40) chunks.push(text);
  };

  for (const line of markdown.replace(/\r/g, "").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      flush();
      continue;
    }
    if (
      trimmed.startsWith("#") ||
      trimmed.startsWith("```") ||
      trimmed.startsWith("![") ||
      trimmed.startsWith("---") ||
      trimmed.startsWith(">") ||
      trimmed.startsWith("|") ||
      trimmed.startsWith("<") ||
      trimmed.startsWith("<!--") ||
      trimmed.startsWith("- ") ||
      trimmed.startsWith("* ")
    ) {
      flush();
      continue;
    }
    buffer.push(trimmed);
  }
  flush();

  return (chunks[0] || "").slice(0, 420);
}

function toolsIn(text) {
  const haystack = text.toLowerCase();
  return TOOLS.filter((tool) => haystack.includes(tool.toLowerCase()));
}

function unique(values) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    const key = value.toLowerCase();
    if (!value || seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

async function readBlurb(name) {
  try {
    const markdown = await readText(
      `https://api.github.com/repos/${USER}/${name}/readme`,
      "application/vnd.github.raw"
    );
    const body = firstParagraph(markdown);
    return {
      body,
      tags: toolsIn(body),
    };
  } catch {
    return { body: "", tags: [] };
  }
}

function buildCard(name, repo, blurb) {
  const note = notes[name];
  const language = repo?.language || "";
  const tags = unique(
    note?.tags?.length
      ? note.tags
      : repo?.topics?.length
        ? repo.topics
        : [...(blurb?.tags || []), language]
  );

  return {
    repo: name,
    live: Boolean(repo),
    kicker: note?.kicker || "Pineado en el perfil",
    title: note?.title || titleFromName(name),
    body:
      note?.body ||
      repo?.description ||
      blurb?.body ||
      "Repositorio público pineado en el perfil.",
    tags,
    language: language || tags[0] || "",
    updated: repo?.updated_at || "",
    updatedLabel: repo?.updated_at
      ? dateFormat.format(new Date(repo.updated_at))
      : "",
    visit: repo?.homepage || note?.visit || "",
    source: repo?.html_url || `https://github.com/${USER}/${name}`,
  };
}

export async function loadPortfolio() {
  const [profileResult, reposResult, pageResult] = await Promise.allSettled([
    readJson(`https://api.github.com/users/${USER}`),
    readJson(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner`),
    readText(`https://github.com/${USER}`, "text/html"),
  ]);

  const repos =
    reposResult.status === "fulfilled"
      ? new Map(reposResult.value.map((repo) => [repo.name, repo]))
      : new Map();

  const pinned =
    pageResult.status === "fulfilled" ? readPinnedNames(pageResult.value) : [];
  const names = pinned.length ? pinned : fallbackNames;
  const livePins = pinned.length > 0;

  const missing = names.filter((name) => !repos.has(name));
  if (missing.length && reposResult.status === "fulfilled") {
    const extras = await Promise.allSettled(
      missing.map((name) => readJson(`https://api.github.com/repos/${USER}/${name}`))
    );
    extras.forEach((result, index) => {
      if (result.status === "fulfilled") repos.set(missing[index], result.value);
    });
  }

  const blurbs = await Promise.all(
    names.map(async (name) => {
      const note = notes[name];
      const repo = repos.get(name);
      if (note?.body || repo?.description) return null;
      return readBlurb(name);
    })
  );

  return {
    publicRepos:
      profileResult.status === "fulfilled" ? profileResult.value.public_repos : 18,
    linkState: livePins ? "En vivo" : "Copia local",
    manuscripts: names.map((name, index) =>
      buildCard(name, repos.get(name), blurbs[index])
    ),
  };
}
