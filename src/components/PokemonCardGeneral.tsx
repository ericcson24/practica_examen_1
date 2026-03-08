import Link from "next/link";
import { Pokemon } from "@/lib/types";
import styles from "./PokemonCardGeneral.module.css";

interface Props {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: Props) {
  const readableName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const readableId = `#${String(pokemon.id).padStart(3, "0")}`;
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <Link href={`/pokemon/${pokemon.id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.row}>
          <span className={styles.id}>{readableId}</span>
          <span className={styles.pill}>Base</span>
        </div>

        <div className={styles.visual}>
          <img src={imageUrl} alt={readableName} className={styles.image} loading="lazy" />
        </div>

        <h2 className={styles.name}>{readableName}</h2>
      </article>
    </Link>
  );
}