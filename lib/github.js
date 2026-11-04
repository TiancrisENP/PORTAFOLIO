import { USER, manuscripts } from "./manuscripts";

const dateFormat = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Bogota",
});

async function readJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "TiancrisENP-portfolio",
    },
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}

function withRepo(card, result) {
  if (result.status !== "fulfilled") return { ...card, live: false };

  const data = result.value;
  return {
    ...card,
    live: true,
    language: data.language || card.language,
    updated: data.updated_at || card.updated,
    updatedLabel: data.updated_at
      ? dateFormat.format(new Date(data.updated_at))
      : card.updatedLabel,
    visit: data.homepage || card.visit,
    source: data.html_url || card.source,
  };
}

export async function loadPortfolio() {
  const [profileResult, ...repoResults] = await Promise.allSettled([
    readJson(`https://api.github.com/users/${USER}`),
    ...manuscripts.map((card) =>
      readJson(`https://api.github.com/repos/${USER}/${card.repo}`)
    ),
  ]);

  const failed = [profileResult, ...repoResults].filter(
    (result) => result.status === "rejected"
  ).length;

  return {
    publicRepos:
      profileResult.status === "fulfilled"
        ? profileResult.value.public_repos
        : 18,
    linkState: failed === 0 ? "En vivo" : "Copia local",
    manuscripts: manuscripts.map((card, index) =>
      withRepo(card, repoResults[index])
    ),
  };
}
