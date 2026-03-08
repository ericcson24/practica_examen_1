"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { Pokemon } from "@/lib/types";
import { getAllPokemons } from "@/lib/api";
import PokemonCard from "@/components/PokemonCardGeneral";

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPokemons = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllPokemons();
      setPokemons(data);
    } catch {
      setError("No se pudieron cargar los Pokemon.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPokemons();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Pokedex</p>
            <h1 className={styles.title}>Listado de Pokemon</h1>
            <p className={styles.subtitle}>Explora los primeros 20 Pokemon de la API.</p>
          </div>

          <button className={styles.reload} onClick={() => void loadPokemons()} type="button">
            Recargar
          </button>
        </header>

        {error && <p className={styles.error}>{error}</p>}

        {isLoading && (
          <div className={styles.placeholderGrid}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={styles.placeholderCard} />
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <>
            <p className={styles.count}>Total cargados: {pokemons.length}</p>

            <div className={styles.grid}>
              {pokemons.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          </>
        )}

        {!isLoading && !error && pokemons.length === 0 && (
          <p className={styles.empty}>No hay Pokemon para mostrar por ahora.</p>
        )}
      </main>
    </div>
  );
}
