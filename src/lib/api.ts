import axios from "axios";
import { Pokemon, PokemonDetail } from "./types";

const api = axios.create({
    baseURL: "https://pokeapi.co/api/v2/pokemon/",
    timeout: 50000,
});

export const getAllPokemons = async (): Promise<Pokemon[]> => {
    try {
        const response = await api.get<{ results: Array<{ name: string; url: string }> }>("?limit=20");

        return response.data.results.map((pokemon) => {
            const id = Number(pokemon.url.split("/").filter(Boolean).pop());
            return {
                id,
                name: pokemon.name,
            };
        });
    } catch (error) {
        console.error("Error al obtener todos los pokemons:", error);
        return [];
    }
};

export const getPokemonById = async (id: string): Promise<PokemonDetail | null> => {
    try {
        const response = await api.get<{
            id: number;
            name: string;
            height: number;
            weight: number;
            base_experience: number;
            types: Array<{ type: { name: string } }>;
            abilities: Array<{ ability: { name: string } }>;
            sprites: { other: { "official-artwork": { front_default: string } } };
        }>(id);

        return {
            id: response.data.id,
            name: response.data.name,
            image: response.data.sprites.other["official-artwork"].front_default,
            height: response.data.height,
            weight: response.data.weight,
            baseExperience: response.data.base_experience,
            types: response.data.types.map((item) => item.type.name),
            abilities: response.data.abilities.map((item) => item.ability.name),
        };
    } catch (error) {
        console.error("Error al obtener detalle del pokemon:", error);
        return null;
    }
};
