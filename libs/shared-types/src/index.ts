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

export interface TypeChartResponse {
  chart: Record<string, Record<string, number>>;
  typeCount: number;
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
  sprite?: string;
}

export interface PokemonSearchResponse {
  results: PokemonSummary[];
}
