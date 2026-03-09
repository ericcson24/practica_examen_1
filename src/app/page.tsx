"use client";

import type React from "react";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { Pokemon } from "@/lib/types";
import { getAllPokemons } from "@/lib/api";
import PokemonCard from "@/components/PokemonCardGeneral";

type CartItem = {
  pokemonId: number;
  name: string;
  quantity: number;
};

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

  const getQuantityForPokemon = (pokemonId: number) => {
    const found = cart.find((item) => item.pokemonId === pokemonId);
    return found ? found.quantity : 0;
  };

  const getSetNumerito = (
    pokemon: Pokemon,
  ): React.Dispatch<React.SetStateAction<number>> => {
    return (valueOrUpdater) => {
      setCart((previous) => {
        const currentIndex = previous.findIndex((item) => item.pokemonId === pokemon.id);
        const currentQuantity = currentIndex >= 0 ? previous[currentIndex].quantity : 0;
        const rawNext =
          typeof valueOrUpdater === "function"
            ? valueOrUpdater(currentQuantity)
            : valueOrUpdater;
        const nextQuantity = Math.max(0, rawNext);

        if (currentIndex === -1) {
          if (nextQuantity === 0) {
            return previous;
          }

          return [
            ...previous,
            {
              pokemonId: pokemon.id,
              name: pokemon.name,
              quantity: nextQuantity,
            },
          ];
        }

        if (nextQuantity === 0) {
          return previous.filter((item) => item.pokemonId !== pokemon.id);
        }

        return previous.map((item) =>
          item.pokemonId === pokemon.id ? { ...item, quantity: nextQuantity } : item,
        );
      });
    };
  };

  const addToCart = (pokemon: Pokemon) => {
    setCart((previous) => {
      const existingItem = previous.find((item) => item.pokemonId === pokemon.id);

      if (existingItem) {
        return previous.map((item) =>
          item.pokemonId === pokemon.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...previous,
        {
          pokemonId: pokemon.id,
          name: pokemon.name,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (pokemonId: number) => {
    setCart((previous) => {
      const currentItem = previous.find((item) => item.pokemonId === pokemonId);

      if (!currentItem) {
        return previous;
      }

      if (currentItem.quantity <= 1) {
        return previous.filter((item) => item.pokemonId !== pokemonId);
      }

      return previous.map((item) =>
        item.pokemonId === pokemonId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
    });
  };

  const increaseFromCart = (pokemonId: number) => {
    setCart((previous) =>
      previous.map((item) =>
        item.pokemonId === pokemonId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

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
          <div className={styles.layout}>
            <section className={styles.catalog}>
              <p className={styles.count}>Total cargados: {pokemons.length}</p>

              <div className={styles.grid}>
                {pokemons.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    elNumerito={getQuantityForPokemon(pokemon.id)}
                    setNumerito={getSetNumerito(pokemon)}
                  />
                ))}
              </div>
            </section>

            <aside className={styles.cart}>
              <h2 className={styles.cartTitle}>Carrito ({totalItemsInCart})</h2>

              {cart.length === 0 && (
                <p className={styles.cartEmpty}>Todavia no compraste Pokemon.</p>
              )}

              {cart.length > 0 && (
                <ol className={styles.cartList}>
                  {cart.map((item, index) => (
                    <li key={item.pokemonId}>
                      <div className={styles.cartItem}>
                        <span className={styles.cartItemNumber}>{index + 1}</span>
                        <span className={styles.cartItemName}>{item.name}</span>

                        <div className={styles.cartActions}>
                          <button
                            className={styles.actionButton}
                            onClick={() => removeFromCart(item.pokemonId)}
                            type="button"
                          >
                            -
                          </button>

                          <span className={styles.cartItemQty}>x{item.quantity}</span>

                          <button
                            className={styles.actionButton}
                            onClick={() => increaseFromCart(item.pokemonId)}
                            type="button"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              <p className={styles.cartHint}>Usa - y + para bajar o subir unidades.</p>
            </aside>
          </div>
        )}

        {!isLoading && !error && pokemons.length === 0 && (
          <p className={styles.empty}>No hay Pokemon para mostrar por ahora.</p>
        )}
      </main>
    </div>
  );
}
