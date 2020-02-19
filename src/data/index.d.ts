interface Pokedex {
  pokedex: Map<string, any>;
  regions: {
    kanto: any[];
    new: any[];
    johto: any[];
    hoenn: any[];
    hoenn_oras: any[];
    sinnoh: any[];
    sinnoh_pt: any[];
    unova: any[];
    unova_n: any[];
    kalos: any[];
    alola: any[];
    alola_u: any[];
    galar: any[];
  };
}

export function constructPokedex(): Pokedex;
