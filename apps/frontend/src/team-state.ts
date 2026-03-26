import type { PokemonSummary } from "../../../libs/shared-types/src";

export const TEAM_LIMIT = 6;
export const TEAM_STORAGE_KEY = "ptb-team";

export function parseTeamNamesFromUrl(url: string): string[] {
  const parsed = new URL(url, "http://localhost");
  const raw = parsed.searchParams.get("team");

  if (!raw) return [];

  return raw
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, TEAM_LIMIT);
}

export function canAddToTeam(team: PokemonSummary[]): boolean {
  return team.length < TEAM_LIMIT;
}

export function isDuplicate(
  team: PokemonSummary[],
  candidate: PokemonSummary,
): boolean {
  return team.some((pokemon) => pokemon.id === candidate.id);
}

export function encodeTeamNames(team: PokemonSummary[]): string {
  return team.map((pokemon) => pokemon.name.toLowerCase()).join(",");
}

export function applyTeamToUrl(url: string, team: PokemonSummary[]): string {
  const parsed = new URL(url, "http://localhost");

  if (team.length === 0) {
    parsed.searchParams.delete("team");
  } else {
    parsed.searchParams.set("team", encodeTeamNames(team));
  }

  const query = parsed.searchParams.toString();
  return `${parsed.pathname}${query ? `?${query}` : ""}`;
}

export function restoreTeam(
  url: string,
  fromStorage: PokemonSummary[],
  catalog: PokemonSummary[],
): PokemonSummary[] {
  const namesFromUrl = parseTeamNamesFromUrl(url);

  if (namesFromUrl.length > 0) {
    return namesFromUrl
      .map((name) => {
        const inStorage = fromStorage.find(
          (pokemon) => pokemon.name.toLowerCase() === name,
        );
        if (inStorage) return inStorage;

        return catalog.find((pokemon) => pokemon.name.toLowerCase() === name);
      })
      .filter((pokemon): pokemon is PokemonSummary => Boolean(pokemon))
      .slice(0, TEAM_LIMIT);
  }

  return fromStorage.slice(0, TEAM_LIMIT);
}
