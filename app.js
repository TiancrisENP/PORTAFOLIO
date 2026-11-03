const USER = "TiancrisENP";

const dateFormat = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node && value != null && value !== "") node.textContent = value;
}

async function readJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!response.ok) throw new Error(String(response.status));
  return response.json();
}

async function bindProfile() {
  const profile = await readJson(`https://api.github.com/users/${USER}`);
  setText("[data-field='public-repos']", String(profile.public_repos));
  return profile;
}

async function bindCard(card) {
  const repo = card.dataset.repo;
  const data = await readJson(`https://api.github.com/repos/${USER}/${repo}`);
  const language = card.querySelector("[data-field='lang']");
  if (language && data.language) language.textContent = data.language;

  const updated = card.querySelector("[data-field='updated']");
  if (updated && data.updated_at) {
    updated.dateTime = data.updated_at;
    updated.textContent = dateFormat.format(new Date(data.updated_at));
  }

  const visit = [...card.querySelectorAll("a")].find((link) =>
    link.textContent.includes("Visitar")
  );
  if (visit && data.homepage) visit.href = data.homepage;

  const source = [...card.querySelectorAll("a")].find((link) =>
    link.textContent.includes("Repositorio")
  );
  if (source && data.html_url) source.href = data.html_url;

  card.classList.add("is-live");
}

async function main() {
  const cards = [...document.querySelectorAll(".manuscript")];
  const jobs = cards.map((card) => bindCard(card));
  const results = await Promise.allSettled([bindProfile(), ...jobs]);
  const failed = results.filter((result) => result.status === "rejected").length;
  const state = document.querySelector("[data-field='link-state']");
  if (!state) return;
  state.textContent = failed === 0 ? "En vivo" : "Copia local";
}

main();
