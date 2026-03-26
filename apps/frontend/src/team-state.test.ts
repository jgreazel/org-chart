import { describe, expect, it } from "vitest";
import type { PokemonSummary } from "../../../libs/shared-types/src";
import {
  TEAM_LIMIT,
  applyTeamToUrl,
  canAddToTeam,
  isDuplicate,
  parseTeamNamesFromUrl,
  restoreTeam,
} from "./team-state";

const bulbasaur: PokemonSummary = {
  id: 1,
  name: "bulbasaur",
  types: ["grass", "poison"],
};

const charmander: PokemonSummary = {
  id: 4,
  name: "charmander",
  types: ["fire"],
};

describe("AC-1 team constraints", () => {
  it("allows add when team has fewer than 6", () => {
    const team = [bulbasaur, charmander];
    expect(canAddToTeam(team)).toBe(true);
  });

  it("blocks add when team already has 6", () => {
    const team = new Array(TEAM_LIMIT).fill(bulbasaur);
    expect(canAddToTeam(team)).toBe(false);
  });

  it("detects duplicate pokemon by id", () => {
    const team = [bulbasaur];
    expect(isDuplicate(team, bulbasaur)).toBe(true);
    expect(isDuplicate(team, charmander)).toBe(false);
  });
});

describe("AC-8 URL encoding and decoding", () => {
  it("encodes team names into query params", () => {
    const url = applyTeamToUrl("http://localhost:3000", [
      bulbasaur,
      charmander,
    ]);
    expect(url).toBe("/?team=bulbasaur%2Ccharmander");
  });

  it("removes team query when team is empty", () => {
    const url = applyTeamToUrl("http://localhost:3000/?team=bulbasaur", []);
    expect(url).toBe("/");
  });

  it("parses and clamps team names to max 6", () => {
    const names = parseTeamNamesFromUrl(
      "http://localhost:3000/?team=a,b,c,d,e,f,g",
    );

    expect(names.length).toBe(6);
    expect(names[0]).toBe("a");
    expect(names[5]).toBe("f");
  });
});

describe("AC-7 restore persistence", () => {
  it("prefers URL team when valid entries exist", () => {
    const storage = [bulbasaur, charmander];
    const catalog = [bulbasaur, charmander];

    const restored = restoreTeam(
      "http://localhost:3000/?team=charmander,bulbasaur",
      storage,
      catalog,
    );

    expect(restored.map((p) => p.name)).toEqual(["charmander", "bulbasaur"]);
  });

  it("falls back to storage when URL is missing", () => {
    const storage = [bulbasaur];
    const restored = restoreTeam("http://localhost:3000/", storage, []);
    expect(restored.map((p) => p.name)).toEqual(["bulbasaur"]);
  });
});
