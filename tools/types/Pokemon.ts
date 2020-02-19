export interface Pokemon {
  nationalPokedexNumber: number;
  name: string;
  typeIds: number[];
  form: string;
}

export interface Variant {
  nationalPokedexNumber: number;
  regionId: number;
  typeIds: number[];
}

export type PokemonInstance = Pokemon | Variant;

export function isPokemon(item: PokemonInstance): item is Pokemon {
  return (item as Pokemon).name !== undefined;
}

export function isVariant(item: PokemonInstance): item is Variant {
  return (item as Variant).regionId !== undefined;
}
