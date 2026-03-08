import Link from "next/link";
import { notFound } from "next/navigation";
import { getPokemonById } from "@/lib/api";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = await params;
  const pokemon = await getPokemonById(id);

  if (!pokemon) {
    notFound();
  }

  const readableName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const readableId = `#${String(pokemon.id).padStart(3, "0")}`;

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.back}>
          Volver al listado
        </Link>

        <section className={styles.card}>
          <div className={styles.hero}>
            <img src={pokemon.image} alt={readableName} className={styles.image} />
          </div>

          <div className={styles.info}>
            <p className={styles.id}>{readableId}</p>
            <h1 className={styles.title}>{readableName}</h1>

            <div className={styles.group}>
              <h2>Tipos</h2>
              <div className={styles.badges}>
                {pokemon.types.map((type) => (
                  <span key={type} className={styles.badge}>
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span>Altura</span>
                <strong>{pokemon.height}</strong>
              </div>
              <div className={styles.statItem}>
                <span>Peso</span>
                <strong>{pokemon.weight}</strong>
              </div>
              <div className={styles.statItem}>
                <span>Exp. base</span>
                <strong>{pokemon.baseExperience}</strong>
              </div>
            </div>

            <div className={styles.group}>
              <h2>Habilidades</h2>
              <ul className={styles.list}>
                {pokemon.abilities.map((ability) => (
                  <li key={ability}>{ability}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
