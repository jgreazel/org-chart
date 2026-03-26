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
    return;
  }

  for (const pokemon of team) {
    const li = document.createElement("li");
    li.className = "team-item item-enter";

    const label = document.createElement("span");
    label.textContent = `${pokemon.name} (#${pokemon.id}) - ${pokemon.types.join(", ")}`;

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
}

function renderSuggestions() {
  if (!suggestionListEl) return;
  suggestionListEl.innerHTML = "";

  for (const pokemon of currentSearchResults.slice(0, 6)) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion-button";
    button.textContent = `${pokemon.name} (${pokemon.types.join("/")})`;
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
    el.textContent = `Loaded ${data.typeCount} types.`;
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
      li.textContent = `${leader.name}: ${leader.pokemonTypes.join(", ")}`;
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

void searchPokemon("").then(() => {
  hydrateTeam();
  renderSuggestions();
});
wireEvents();
void loadHealth();
void loadTypeChart();
void loadGymSample();
