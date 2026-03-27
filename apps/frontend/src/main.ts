import type {
  GenerationGyms,
  PokemonSearchResponse,
  PokemonSummary,
  TypeChartResponse,
} from "../../../libs/shared-types/src";
import {
  TEAM_STORAGE_KEY,
  applyTeamToUrl,
  canAddToTeam,
  isDuplicate,
  restoreTeam,
} from "./team-state";

const teamListEl = document.getElementById(
  "teamList",
) as HTMLUListElement | null;
const teamMessageEl = document.getElementById(
  "teamMessage",
) as HTMLParagraphElement | null;
const shareLinkEl = document.getElementById(
  "shareLink",
) as HTMLParagraphElement | null;
const queryInputEl = document.getElementById(
  "pokemonQuery",
) as HTMLInputElement | null;
const addButtonEl = document.getElementById(
  "addPokemon",
) as HTMLButtonElement | null;
const suggestionListEl = document.getElementById(
  "pokemonSuggestions",
) as HTMLUListElement | null;
const generationSelectEl = document.getElementById(
  "generationSelect",
) as HTMLSelectElement | null;

let team: PokemonSummary[] = [];
let currentSearchResults: PokemonSummary[] = [];
let revealAnimated = false;
let storedTypeChart: Record<string, Record<string, number>> | null = null;

function typePill(type: string): string {
  return `<span class="type-pill type-${type}">${type}</span>`;
}

function computeTypeCoverage(
  teamPokemon: PokemonSummary[],
  chart: Record<string, Record<string, number>>,
) {
  const allTypes = Object.keys(chart);
  const attackCoverage = new Set<string>();
  const weaknessHits = new Map<string, number>();

  for (const pokemon of teamPokemon) {
    for (const atkType of pokemon.types) {
      const row = chart[atkType] ?? {};
      for (const [defType, eff] of Object.entries(row)) {
        if (eff >= 2) attackCoverage.add(defType);
      }
    }
    for (const atkType of allTypes) {
      const row = chart[atkType] ?? {};
      let totalEff = 1;
      for (const defType of pokemon.types) {
        totalEff *= row[defType] ?? 1;
      }
      if (totalEff >= 2) {
        weaknessHits.set(atkType, (weaknessHits.get(atkType) ?? 0) + 1);
      }
    }
  }

  const coverageGaps = allTypes.filter((t) => !attackCoverage.has(t)).sort();
  const teamWeaknesses = [...weaknessHits.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([type]) => type);

  return {
    attackCoverage: [...attackCoverage].sort(),
    teamWeaknesses,
    coverageGaps,
  };
}

function renderTypeCoverage() {
  const section = document.getElementById("coverageSection");
  if (!section) return;

  if (!storedTypeChart || team.length === 0) {
    section.innerHTML =
      '<p class="coverage-empty">Add Pokemon to your team to see coverage analysis.</p>';
    return;
  }

  const { attackCoverage, teamWeaknesses, coverageGaps } = computeTypeCoverage(
    team,
    storedTypeChart,
  );

  section.innerHTML = `
    <div class="coverage-grid">
      <div class="coverage-item">
        <h3>Super Effective Against <span class="badge badge-green">${attackCoverage.length} / 18</span></h3>
        <div class="type-pills">${attackCoverage.length > 0 ? attackCoverage.map(typePill).join("") : '<span class="coverage-empty">None yet</span>'}</div>
      </div>
      <div class="coverage-item">
        <h3>Team Weaknesses <span class="badge badge-red">${teamWeaknesses.length}</span></h3>
        ${
          teamWeaknesses.length > 0
            ? `<div class="type-pills">${teamWeaknesses.map(typePill).join("")}</div>`
            : '<p class="coverage-ok">No shared weaknesses!</p>'
        }
      </div>
      <div class="coverage-item">
        <h3>Coverage Gaps <span class="badge badge-amber">${coverageGaps.length}</span></h3>
        ${
          coverageGaps.length > 0
            ? `<div class="type-pills">${coverageGaps.map(typePill).join("")}</div>`
            : '<p class="coverage-ok">Full type coverage!</p>'
        }
      </div>
    </div>`;
}

function saveTeam() {
  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));

  const newRelativeUrl = applyTeamToUrl(window.location.href, team);
  window.history.replaceState({}, "", newRelativeUrl);
  updateShareLink();
}

function updateShareLink() {
  if (!shareLinkEl) return;

  if (team.length === 0) {
    shareLinkEl.textContent = "Build a team to generate a shareable link.";
    return;
  }

  shareLinkEl.textContent = `Share: ${window.location.href}`;
}

function setMessage(message: string) {
  if (teamMessageEl) {
    teamMessageEl.textContent = message;
  }
}

function renderTeam() {
  if (!teamListEl) return;

  teamListEl.innerHTML = "";

  if (team.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No Pokemon selected yet.";
    teamListEl.appendChild(li);
    renderTypeCoverage();
    return;
  }

  for (const pokemon of team) {
    const li = document.createElement("li");
    li.className = "team-item item-enter";

    const label = document.createElement("span");
    label.className = "team-item-label";
    label.innerHTML = `<strong>${pokemon.name}</strong> <span class="team-item-id">#${pokemon.id}</span> ${pokemon.types.map(typePill).join("")}`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.type = "button";
    removeButton.addEventListener("click", () => {
      li.classList.remove("item-enter");
      li.classList.add("item-exit");

      team = team.filter((candidate) => candidate.id !== pokemon.id);

      window.setTimeout(() => {
        renderTeam();
        saveTeam();
        setMessage(`${pokemon.name} removed from team.`);
      }, 180);
    });

    li.appendChild(label);
    li.appendChild(removeButton);
    teamListEl.appendChild(li);
  }

  renderTypeCoverage();
}

function renderSuggestions() {
  if (!suggestionListEl) return;
  suggestionListEl.innerHTML = "";

  for (const pokemon of currentSearchResults.slice(0, 6)) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion-button";
    button.innerHTML = `${pokemon.name} ${pokemon.types.map(typePill).join("")}`;
    button.addEventListener("click", () => {
      addPokemonByName(pokemon.name);
      if (queryInputEl) {
        queryInputEl.value = pokemon.name;
      }
    });
    li.appendChild(button);
    suggestionListEl.appendChild(li);
  }
}

async function searchPokemon(query: string) {
  const res = await fetch(`/api/pokemon/search?q=${encodeURIComponent(query)}`);
  const data = (await res.json()) as PokemonSearchResponse;
  currentSearchResults = data.results;
}

function addPokemonByName(name: string) {
  const match = currentSearchResults.find(
    (pokemon) => pokemon.name.toLowerCase() === name.toLowerCase(),
  );

  if (!match) {
    setMessage("No matching Pokemon found. Try another name.");
    return;
  }

  if (!canAddToTeam(team)) {
    setMessage("Team is full. Remove one before adding another.");
    return;
  }

  if (isDuplicate(team, match)) {
    setMessage("That Pokemon is already in your team.");
    return;
  }

  team.push(match);
  renderTeam();
  saveTeam();
  setMessage(`${match.name} added.`);
}

function hydrateTeam() {
  const fromStorageRaw = localStorage.getItem(TEAM_STORAGE_KEY);
  const fromStorage = fromStorageRaw
    ? (JSON.parse(fromStorageRaw) as PokemonSummary[])
    : [];

  team = restoreTeam(window.location.href, fromStorage, currentSearchResults);

  renderTeam();
  updateShareLink();
}

async function loadHealth() {
  const el = document.getElementById("health");
  if (!el) return;

  try {
    const res = await fetch("/health");
    const data = await res.json();
    el.textContent =
      data.status === "ok" ? "API is healthy" : "API status unknown";
  } catch {
    el.textContent = "API unavailable. Start backend on port 3001.";
  }
}

async function loadTypeChart() {
  const el = document.getElementById("typeCount");
  if (!el) return;

  try {
    const res = await fetch("/api/types/chart");
    const data = (await res.json()) as TypeChartResponse;
    storedTypeChart = data.chart;
    el.textContent = `Loaded ${data.typeCount} types.`;
    renderTypeCoverage();
  } catch {
    el.textContent = "Failed to load type chart.";
  }
}

async function loadGymSample(generation = 1) {
  const list = document.getElementById("gymLeaders");
  if (!list) return;

  try {
    const res = await fetch(`/api/gyms?generation=${generation}`);
    const data = (await res.json()) as GenerationGyms;

    list.innerHTML = "";
    if (!revealAnimated) {
      list.classList.add("reveal");
      revealAnimated = true;
    }

    for (const leader of data.leaders) {
      const li = document.createElement("li");
      li.className = "gym-leader-item";
      li.innerHTML = `<span class="gym-leader-name">${leader.name}</span><span class="type-pills">${leader.pokemonTypes.map(typePill).join("")}</span>`;
      list.appendChild(li);
    }

    if (data.leaders.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No leaders yet.";
      list.appendChild(li);
    }
  } catch {
    list.innerHTML = "<li>Failed to load gyms.</li>";
  }
}

function wireEvents() {
  queryInputEl?.addEventListener("input", async (event) => {
    const target = event.target as HTMLInputElement;
    const query = target.value.trim();

    try {
      await searchPokemon(query);
      renderSuggestions();
    } catch {
      setMessage("Unable to load suggestions right now.");
    }
  });

  addButtonEl?.addEventListener("click", async () => {
    const query = queryInputEl?.value.trim().toLowerCase();
    if (!query) {
      setMessage("Enter a Pokemon name first.");
      return;
    }

    try {
      await searchPokemon(query);
      renderSuggestions();
      addPokemonByName(query);
    } catch {
      setMessage("Search failed. Check backend status and retry.");
    }
  });

  generationSelectEl?.addEventListener("change", async (event) => {
    const target = event.target as HTMLSelectElement;
    const generation = Number(target.value);
    await loadGymSample(generation);
  });
}

function initAds() {
  const publisherId = (
    import.meta.env.VITE_ADSENSE_CLIENT as string | undefined
  )?.trim();
  if (!publisherId) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
  script.setAttribute("crossorigin", "anonymous");
  document.head.appendChild(script);

  const coverageCard = document
    .getElementById("coverageSection")
    ?.closest(".card");
  if (coverageCard) {
    const adWrap = document.createElement("div");
    adWrap.className = "ad-unit";
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.cssText = "display:block";
    ins.setAttribute("data-ad-client", publisherId);
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");
    adWrap.appendChild(ins);
    coverageCard.insertAdjacentElement("afterend", adWrap);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
  }
}

void searchPokemon("").then(() => {
  hydrateTeam();
  renderSuggestions();
});
wireEvents();
void loadHealth();
void loadTypeChart();
void loadGymSample();
initAds();
