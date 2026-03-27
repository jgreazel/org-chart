import type {
  GenerationGyms,
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

/* ── Constants ── */
const SAVED_TEAMS_KEY = "ptb-saved-teams";
const ALL_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

/* ── DOM refs ── */
const teamCounterEl = document.getElementById("teamCounter")!;
const shareLinkEl = document.getElementById("shareLink")!;
const teamSlotsEl = document.getElementById("teamSlots")!;
const coverageBarEl = document.getElementById("coverageBar")!;
const covAttackEl = document.getElementById("covAttack")!;
const covWeakEl = document.getElementById("covWeak")!;
const covGapsEl = document.getElementById("covGaps")!;
const browseGridEl = document.getElementById("browseGrid")!;
const teamsPanelEl = document.getElementById("teamsPanel")!;
const savedTeamsListEl = document.getElementById("savedTeamsList")!;
const filterInputEl = document.getElementById(
  "filterInput",
) as HTMLInputElement;
const typeFiltersEl = document.getElementById("typeFilters")!;
const generationSelectEl = document.getElementById(
  "generationSelect",
) as HTMLSelectElement;
const gymStripEl = document.getElementById("gymStrip")!;
const toastEl = document.getElementById("teamMessage")!;
const saveTeamBtnEl = document.getElementById("saveTeamBtn")!;

/* ── State ── */
let team: PokemonSummary[] = [];
let fullCatalog: PokemonSummary[] = [];
let storedTypeChart: Record<string, Record<string, number>> | null = null;
let activeTypeFilter: string | null = null;
let currentTab: "pokemon" | "teams" = "pokemon";
let currentGymGeneration = 1;
let toastTimer: ReturnType<typeof setTimeout> | null = null;
let filterDebounce: ReturnType<typeof setTimeout> | null = null;

interface SavedTeam {
  name: string;
  members: PokemonSummary[];
  created: number;
}

/* ── Helpers ── */
function typePill(type: string): string {
  return `<span class="type-pill type-${type}">${type}</span>`;
}

function showToast(msg: string) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2000);
}

/* ── Team management ── */
function saveTeam() {
  localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
  const newUrl = applyTeamToUrl(window.location.href, team);
  window.history.replaceState({}, "", newUrl);
}

function updateHud() {
  // Counter
  teamCounterEl.textContent = `${team.length} / 6`;
  teamCounterEl.className = `team-counter${team.length >= 6 ? " team-full" : ""}`;

  // Share link
  if (team.length > 0) {
    shareLinkEl.textContent = window.location.href;
    shareLinkEl.title = window.location.href;
  } else {
    shareLinkEl.textContent = "";
  }

  // Slots
  const slots = teamSlotsEl.querySelectorAll(".team-slot");
  slots.forEach((slot, i) => {
    const pokemon = team[i];
    if (pokemon) {
      slot.className = "team-slot filled";
      slot.innerHTML = `
        <span class="slot-name">${pokemon.name}</span>
        <span class="slot-types">${pokemon.types.map(typePill).join("")}</span>
        <button class="slot-remove" aria-label="Remove ${pokemon.name}">\u2715</button>`;
      slot.querySelector(".slot-remove")!.addEventListener("click", (e) => {
        e.stopPropagation();
        removePokemon(pokemon.id);
      });
    } else {
      slot.className = "team-slot empty";
      slot.innerHTML = "";
    }
  });

  // Coverage bar
  updateCoverageBar();
}

function updateCoverageBar() {
  if (!storedTypeChart || team.length === 0) {
    covAttackEl.innerHTML = "\u2694 <strong>0</strong>/18";
    covWeakEl.innerHTML = "\ud83d\udee1 <strong>0</strong>";
    covGapsEl.innerHTML = "\u25CC <strong>0</strong> gaps";
    return;
  }

  const allTypes = Object.keys(storedTypeChart);
  const attackCoverage = new Set<string>();
  const weaknessHits = new Map<string, number>();

  for (const pokemon of team) {
    for (const atkType of pokemon.types) {
      const row = storedTypeChart[atkType] ?? {};
      for (const [defType, eff] of Object.entries(row)) {
        if (eff >= 2) attackCoverage.add(defType);
      }
    }
    for (const atkType of allTypes) {
      const row = storedTypeChart[atkType] ?? {};
      let totalEff = 1;
      for (const defType of pokemon.types) {
        totalEff *= row[defType] ?? 1;
      }
      if (totalEff >= 2) {
        weaknessHits.set(atkType, (weaknessHits.get(atkType) ?? 0) + 1);
      }
    }
  }

  const gaps = allTypes.filter((t) => !attackCoverage.has(t)).length;
  const shared = [...weaknessHits.values()].filter((c) => c >= 2).length;

  covAttackEl.innerHTML = `\u2694 <strong>${attackCoverage.size}</strong>/18`;
  covWeakEl.innerHTML = `\ud83d\udee1 <strong>${shared}</strong>`;
  covGapsEl.innerHTML = `\u25CC <strong>${gaps}</strong> gaps`;
}

function addPokemon(pokemon: PokemonSummary) {
  if (!canAddToTeam(team)) {
    showToast("Team full! Remove one first.");
    return;
  }
  if (isDuplicate(team, pokemon)) {
    showToast(`${pokemon.name} is already on your team.`);
    return;
  }
  team.push(pokemon);
  saveTeam();
  updateHud();
  renderBrowseGrid();
  loadGymStrip(currentGymGeneration);
  showToast(`${pokemon.name} added!`);
}

function removePokemon(id: number) {
  const removed = team.find((p) => p.id === id);
  team = team.filter((p) => p.id !== id);
  saveTeam();
  updateHud();
  renderBrowseGrid();
  loadGymStrip(currentGymGeneration);
  if (removed) showToast(`${removed.name} removed.`);
}

/* ── Browse grid ── */
function getFilteredCatalog(): PokemonSummary[] {
  let pool = fullCatalog;
  const q = filterInputEl.value.trim().toLowerCase();

  if (activeTypeFilter) {
    pool = pool.filter((p) => p.types.includes(activeTypeFilter as never));
  }

  if (q) {
    pool = pool.filter((p) => {
      if (p.name.includes(q)) return true;
      const words = p.name.split(/\s+/);
      return words.some((w) => w.startsWith(q));
    });
  }

  return pool;
}

function renderBrowseGrid() {
  const filtered = getFilteredCatalog();
  browseGridEl.innerHTML = "";

  if (filtered.length === 0) {
    browseGridEl.innerHTML =
      '<div class="browse-empty">No Pokemon match your filter.</div>';
    return;
  }

  for (const pokemon of filtered) {
    const inTeam = team.some((t) => t.id === pokemon.id);
    const card = document.createElement("div");
    card.className = `poke-card${inTeam ? " in-team" : ""}`;
    card.setAttribute("role", "listitem");
    card.innerHTML = `
      <span class="poke-id">#${pokemon.id}</span>
      <span class="poke-name">${pokemon.name}</span>
      <span class="poke-types">${pokemon.types.map(typePill).join("")}</span>`;
    card.addEventListener("click", () => {
      if (inTeam) {
        removePokemon(pokemon.id);
      } else {
        addPokemon(pokemon);
      }
    });
    browseGridEl.appendChild(card);
  }
}

/* ── Type filter pills ── */
function renderTypeFilters() {
  typeFiltersEl.innerHTML = "";
  for (const type of ALL_TYPES) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `type-filter-btn type-${type}${activeTypeFilter === type ? " active" : ""}`;
    btn.textContent = type;
    btn.addEventListener("click", () => {
      activeTypeFilter = activeTypeFilter === type ? null : type;
      renderTypeFilters();
      renderBrowseGrid();
    });
    typeFiltersEl.appendChild(btn);
  }
}

/* ── Tabs ── */
function switchTab(tab: "pokemon" | "teams") {
  currentTab = tab;
  document.querySelectorAll(".tab").forEach((t) => {
    const isActive = t.getAttribute("data-tab") === tab;
    t.classList.toggle("active", isActive);
    t.setAttribute("aria-selected", String(isActive));
  });

  const filterRow = document.querySelector(".filter-row") as HTMLElement;

  if (tab === "pokemon") {
    browseGridEl.hidden = false;
    teamsPanelEl.hidden = true;
    if (filterRow) filterRow.hidden = false;
  } else {
    browseGridEl.hidden = true;
    teamsPanelEl.hidden = false;
    if (filterRow) filterRow.hidden = true;
    renderSavedTeams();
  }
}

/* ── Saved teams ── */
function getSavedTeams(): SavedTeam[] {
  try {
    return JSON.parse(
      localStorage.getItem(SAVED_TEAMS_KEY) ?? "[]",
    ) as SavedTeam[];
  } catch {
    return [];
  }
}

function persistSavedTeams(teams: SavedTeam[]) {
  localStorage.setItem(SAVED_TEAMS_KEY, JSON.stringify(teams));
}

function saveCurrentTeam() {
  if (team.length === 0) {
    showToast("Add Pokemon to your team first!");
    return;
  }
  const teams = getSavedTeams();
  const name = `Team ${teams.length + 1} (${team.map((p) => p.name).join(", ")})`;
  teams.unshift({ name, members: [...team], created: Date.now() });
  persistSavedTeams(teams);
  showToast("Team saved!");
  if (currentTab === "teams") renderSavedTeams();
}

function loadSavedTeam(saved: SavedTeam) {
  team = saved.members
    .filter((m) => fullCatalog.some((c) => c.id === m.id))
    .slice(0, 6);
  saveTeam();
  updateHud();
  renderBrowseGrid();
  loadGymStrip(currentGymGeneration);
  switchTab("pokemon");
  showToast(`Loaded: ${saved.name}`);
}

function deleteSavedTeam(index: number) {
  const teams = getSavedTeams();
  teams.splice(index, 1);
  persistSavedTeams(teams);
  renderSavedTeams();
  showToast("Team deleted.");
}

function renderSavedTeams() {
  const teams = getSavedTeams();
  savedTeamsListEl.innerHTML = "";

  if (teams.length === 0) {
    savedTeamsListEl.innerHTML =
      '<div class="teams-empty">No saved teams yet. Build a team and press Save!</div>';
    return;
  }

  teams.forEach((saved, i) => {
    const card = document.createElement("div");
    card.className = "saved-team-card";
    card.setAttribute("role", "listitem");

    const members = saved.members
      .map((m) => `<span class="saved-team-member">${m.name}</span>`)
      .join("");

    card.innerHTML = `
      <div class="saved-team-name">${saved.name}</div>
      <div class="saved-team-members">${members}</div>
      <div class="saved-team-actions">
        <button class="hud-btn load-btn">Load</button>
        <button class="hud-btn del-btn" style="color:#f87171">Delete</button>
      </div>`;

    card.querySelector(".load-btn")!.addEventListener("click", (e) => {
      e.stopPropagation();
      loadSavedTeam(saved);
    });
    card.querySelector(".del-btn")!.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteSavedTeam(i);
    });

    savedTeamsListEl.appendChild(card);
  });
}

/* ── Gym matchup strip ── */
function computeGymMatchup(
  pokemon: PokemonSummary,
  gymTypes: string[],
  chart: Record<string, Record<string, number>>,
): "strong" | "weak" | "neutral" {
  let bestAtk = 0;
  let worstDef = 0;
  for (const atkType of pokemon.types) {
    for (const defType of gymTypes) {
      if ((chart[atkType]?.[defType] ?? 1) >= 2) bestAtk++;
    }
  }
  for (const gymType of gymTypes) {
    for (const defType of pokemon.types) {
      if ((chart[gymType]?.[defType] ?? 1) >= 2) worstDef++;
    }
  }
  if (bestAtk > 0 && worstDef === 0) return "strong";
  if (worstDef > 0 && bestAtk === 0) return "weak";
  return "neutral";
}

async function loadGymStrip(generation = 1) {
  currentGymGeneration = generation;
  try {
    const res = await fetch(`/api/gyms?generation=${generation}`);
    const data = (await res.json()) as GenerationGyms;
    gymStripEl.innerHTML = "";

    for (const leader of data.leaders) {
      const chip = document.createElement("div");
      chip.className = "gym-chip";

      let dotsHtml = "";
      if (team.length > 0 && storedTypeChart) {
        const dots = team.map((p) => {
          const result = computeGymMatchup(
            p,
            leader.pokemonTypes,
            storedTypeChart!,
          );
          return `<span class="gym-dot dot-${result}" title="${p.name}: ${result}"></span>`;
        });
        dotsHtml = `<span class="gym-chip-matchup">${dots.join("")}</span>`;
      }

      chip.innerHTML = `
        <span class="gym-chip-name">${leader.name}</span>
        <span class="gym-chip-types">${leader.pokemonTypes.map(typePill).join("")}</span>
        ${dotsHtml}`;
      gymStripEl.appendChild(chip);
    }
  } catch {
    gymStripEl.innerHTML =
      '<span style="color:var(--ink-muted);font-size:0.7rem">Failed to load gyms.</span>';
  }
}

/* ── Data loading ── */
async function loadCatalog() {
  try {
    const res = await fetch("/api/pokemon");
    const data = (await res.json()) as { results: PokemonSummary[] };
    fullCatalog = data.results;
  } catch {
    // Fallback: try search with empty query
    try {
      const res = await fetch("/api/pokemon/search?q=");
      const data = (await res.json()) as { results: PokemonSummary[] };
      fullCatalog = data.results;
    } catch {
      fullCatalog = [];
    }
  }
}

async function loadTypeChart() {
  try {
    const res = await fetch("/api/types/chart");
    const data = (await res.json()) as TypeChartResponse;
    storedTypeChart = data.chart;
  } catch {
    storedTypeChart = null;
  }
}

/* ── Init ── */
function hydrateTeam() {
  const fromStorageRaw = localStorage.getItem(TEAM_STORAGE_KEY);
  const fromStorage = fromStorageRaw
    ? (JSON.parse(fromStorageRaw) as PokemonSummary[])
    : [];
  team = restoreTeam(window.location.href, fromStorage, fullCatalog);
}

function wireEvents() {
  // Filter input with debounce
  filterInputEl.addEventListener("input", () => {
    if (filterDebounce) clearTimeout(filterDebounce);
    filterDebounce = setTimeout(() => renderBrowseGrid(), 150);
  });

  // Tab switching
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      switchTab(tab.getAttribute("data-tab") as "pokemon" | "teams");
    });
  });

  // Generation select
  generationSelectEl.addEventListener("change", () => {
    loadGymStrip(Number(generationSelectEl.value));
  });

  // Save team button
  saveTeamBtnEl.addEventListener("click", () => saveCurrentTeam());
}

async function init() {
  wireEvents();
  renderTypeFilters();

  await Promise.all([loadCatalog(), loadTypeChart()]);

  hydrateTeam();
  updateHud();
  renderBrowseGrid();
  void loadGymStrip();
}

void init();
