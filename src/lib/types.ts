export type Pokemon = {
    id: number;
    name: string;
    sprite?: {
        front_default: string;
    };
};

export type PokemonDetail = {
    id: number;
    name: string;
    image: string;
    height: number;
    weight: number;
    baseExperience: number;
    types: string[];
    abilities: string[];
};