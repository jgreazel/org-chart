import type {
  GenerationGyms,
  TypeChartResponse,
} from "../../../libs/shared-types/src";

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

async function loadGymSample() {
  const list = document.getElementById("gymLeaders");
  if (!list) return;

  try {
    const res = await fetch("/api/gyms?generation=1");
    const data = (await res.json()) as GenerationGyms;

    list.innerHTML = "";
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

void loadHealth();
void loadTypeChart();
void loadGymSample();
