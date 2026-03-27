import cors from "cors";
import express, { Request, Response } from "express";
import { gymsByGeneration } from "./data/gyms";
import { pokemonCatalog } from "./data/pokemon";
import { typeChart } from "./data/type-chart";
import { PokemonSummary, PokemonType } from "./types";

const POKE_API = "https://pokeapi.co/api/v2";
const VALID_TYPES = new Set<string>([
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
]);

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

/* ── Live data cache ── */
let liveCatalog: PokemonSummary[] | null = null;
let liveCatalogLoading: Promise<void> | null = null;

interface PokeApiListResponse {
  results: { name: string; url: string }[];
}

interface PokeApiPokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: { front_default: string | null };
}

async function fetchLiveCatalog(): Promise<PokemonSummary[]> {
  const listRes = await fetch(`${POKE_API}/pokemon?limit=300&offset=0`);
  if (!listRes.ok) throw new Error("PokeAPI list fetch failed");
  const listData = (await listRes.json()) as PokeApiListResponse;

  const detailPromises = listData.results.map(async (entry) => {
    try {
      const res = await fetch(entry.url);
      if (!res.ok) return null;
      const data = (await res.json()) as PokeApiPokemon;
      const types = data.types
        .map((t) => t.type.name)
        .filter((t) => VALID_TYPES.has(t)) as PokemonType[];
      return {
        id: data.id,
        name: data.name,
        types,
        sprite: data.sprites.front_default ?? undefined,
      } satisfies PokemonSummary;
    } catch {
      return null;
    }
  });

  const results = await Promise.all(detailPromises);
  return results
    .filter((p): p is PokemonSummary => p !== null)
    .sort((a, b) => a.id - b.id);
}

function ensureLiveCatalog(): Promise<void> {
  if (liveCatalog) return Promise.resolve();
  if (liveCatalogLoading) return liveCatalogLoading;
  liveCatalogLoading = fetchLiveCatalog()
    .then((catalog) => {
      liveCatalog = catalog;
      console.log(`Live catalog loaded: ${catalog.length} Pokemon`);
    })
    .catch((err) => {
      console.warn("PokeAPI unavailable, using static catalog:", err);
      liveCatalog = pokemonCatalog;
    })
    .finally(() => {
      liveCatalogLoading = null;
    });
  return liveCatalogLoading;
}

// Start prefetching on boot
void ensureLiveCatalog();

function getCatalog(): PokemonSummary[] {
  return liveCatalog ?? pokemonCatalog;
}

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/api/types/chart", (_req: Request, res: Response) => {
  res.json({ chart: typeChart, typeCount: Object.keys(typeChart).length });
});

app.get("/api/pokemon", async (_req: Request, res: Response) => {
  await ensureLiveCatalog();
  res.json({ results: getCatalog() });
});

app.get("/api/pokemon/search", async (req: Request, res: Response) => {
  await ensureLiveCatalog();
  const q = String(req.query.q ?? "")
    .trim()
    .toLowerCase();
  const typeFilter = String(req.query.type ?? "")
    .trim()
    .toLowerCase();

  let pool = getCatalog();

  if (typeFilter) {
    pool = pool.filter((p) => p.types.includes(typeFilter as never));
  }

  if (!q) {
    res.json({ results: pool.slice(0, 12) });
    return;
  }

  const scored = pool
    .map((pokemon) => {
      const name = pokemon.name;
      if (name === q) return { pokemon, score: 0 };
      if (name.startsWith(q)) return { pokemon, score: 1 };
      if (name.includes(q)) return { pokemon, score: 2 };
      // Allow matching each word in multi-word names (e.g. "tapu koko")
      const words = name.split(/\s+/);
      if (words.some((w) => w.startsWith(q))) return { pokemon, score: 1.5 };
      return null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort(
      (a, b) =>
        a.score - b.score || a.pokemon.name.localeCompare(b.pokemon.name),
    );

  res.json({ results: scored.map((s) => s.pokemon).slice(0, 12) });
});

app.get("/api/gyms", (req: Request, res: Response) => {
  const generation = Number(req.query.generation);

  if (!Number.isInteger(generation) || generation < 1 || generation > 9) {
    res.status(400).json({
      error: "generation must be an integer between 1 and 9",
    });
    return;
  }

  res.json(gymsByGeneration[generation]);
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
