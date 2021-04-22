import { GetStaticProps } from "next";
import Image from "next/image";

import api from "../services/api";
import convertDurationToTimeString from "../utils/convertDurationToTimeString";

import ptBR from "date-fns/locale/pt-BR";
import { format, parseISO } from "date-fns";

import styles from "./home.module.scss";

type Episodes = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: Date;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
};

type Props = {
  lastEpisodes: Episodes[];
  allEpisodes: Episodes[];
};

export default function Home({ lastEpisodes, allEpisodes }: Props) {
  return (
    <div className={styles.homepage}>
      <section className={styles.lastEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {lastEpisodes.map((episode) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button>
                  <img src="/play-green.svg" alt="Tocar episodio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos lançamentos</h2>

        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map((episode) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72}}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <a href="">{episode.title}</a>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 80 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button>
                      <img src="/play-green.svg" alt="Tocar episodio" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      description: episode.description,
      url: episode.file.url,
    };
  });

  const lastEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      lastEpisodes: lastEpisodes,
      allEpisodes: allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
