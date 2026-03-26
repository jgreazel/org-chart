import { GenerationGyms } from "../types";

export const gymsByGeneration: Record<number, GenerationGyms> = {
  1: {
    generation: 1,
    leaders: [
      { name: "Brock", pokemonTypes: ["rock", "ground"] },
      { name: "Misty", pokemonTypes: ["water"] },
      { name: "Lt. Surge", pokemonTypes: ["electric"] },
    ],
  },
  2: {
    generation: 2,
    leaders: [
      { name: "Falkner", pokemonTypes: ["flying", "normal"] },
      { name: "Bugsy", pokemonTypes: ["bug"] },
      { name: "Whitney", pokemonTypes: ["normal"] },
    ],
  },
  3: { generation: 3, leaders: [] },
  4: { generation: 4, leaders: [] },
  5: { generation: 5, leaders: [] },
  6: { generation: 6, leaders: [] },
  7: { generation: 7, leaders: [] },
  8: { generation: 8, leaders: [] },
  9: { generation: 9, leaders: [] },
};
