import type React from "react";
import Link from "next/link";
import { Pokemon } from "@/lib/types";
import styles from "./PokemonCardGeneral.module.css";

interface Props {
  pokemon: Pokemon;
  elNumerito: number;
  setNumerito: React.Dispatch<React.SetStateAction<number>>;
}

export default function PokemonCard({
  pokemon,
  elNumerito,
  setNumerito,
}: Props) {
  const readableName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const readableId = `#${String(pokemon.id).padStart(3, "0")}`;
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <article className={styles.card}>
      <div className={styles.row}>
        <span className={styles.id}>{readableId}</span>
        <div className={styles.badges}>
          {elNumerito > 0 && <span className={styles.cartPill}>x{elNumerito}</span>}
          <span className={styles.pill}>Base</span>
        </div>
      </div>

      <Link href={`/pokemon/${pokemon.id}`} className={styles.cardLink}>
        <div className={styles.visual}>
          <img src={imageUrl} alt={readableName} className={styles.image} loading="lazy" />
        </div>

        <h2 className={styles.name}>{readableName}</h2>
      </Link>

      {elNumerito === 0 && (
        <button className={styles.buyButton} onClick={() => setNumerito((n) => n + 1)} type="button">
          Buy
        </button>
      )}

      {elNumerito > 0 && (
        <div className={styles.buyControls}>
          <button
            className={styles.miniButton}
            onClick={() => setNumerito((n) => Math.max(0, n - 1))}
            type="button"
          >
            -
          </button>

          <span className={styles.qtyValue}>x{elNumerito}</span>

          <button className={styles.miniButton} onClick={() => setNumerito((n) => n + 1)} type="button">
            +
          </button>
        </div>
      )}
    </article>
  );
}