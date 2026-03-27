export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export interface PokemonSummary {
  id: number;
  name: string;
  types: PokemonType[];
  sprite?: string;
}

export interface TypeChart {
  [attackingType: string]: Record<string, number>;
}

export interface GymLeader {
  name: string;
  pokemonTypes: PokemonType[];
}

export interface GenerationGyms {
  generation: number;
  leaders: GymLeader[];
}

export interface PokemonSummary {
  id: number;
  name: string;
  types: PokemonType[];
}
