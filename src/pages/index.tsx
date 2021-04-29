import { GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import ptBR from "date-fns/locale/pt-BR";
import { format, parseISO } from "date-fns";
import { useWindowSize } from "../Hook/useWindowSize";

import convertDurationToTimeString from "../utils/convertDurationToTimeString";

import { usePlayer } from "../context/PlayerContext";
import Loading from "../components/Loading";
import api from "../services/api";

import styles from "./home.module.scss";
import { useState } from "react";

type Episodes = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: Date;
  duration: number;
  durationAsString: string;
  url: string;
};

type Props = {
  lattestEpisodes: Episodes[];
  allEpisodes: Episodes[];
};

export default function Home({ lattestEpisodes, allEpisodes }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  
  const { playList } = usePlayer();
  const episodeList = [...lattestEpisodes, ...allEpisodes];
  
  const isMobile = useWindowSize().width <= 768 ? true : false;

  window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js");
    }
  });

  setTimeout(() => {
    setIsLoading(false);
  }, 3000);

  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <div className={styles.homepage}>
      <Head>
        <title> Home | Podcastr </title>
      </Head>
      <section className={styles.lattestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {lattestEpisodes.map((episode, index) => {
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
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>

                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button
                  type="button"
                  onClick={() => playList(episodeList, index)}
                >
                  <img src="/play-green.svg" alt="Tocar episodio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section
        className={isMobile ? styles.allEpisodesMobile : styles.allEpisodes}
      >
        <h2>Todos lançamentos</h2>
        {isMobile ? (
          <ul>
            {allEpisodes.map((episode, index) => {
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
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>

                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      playList(episodeList, index + lattestEpisodes.length)
                    }
                  >
                    <img src="/play-green.svg" alt="Tocar episodio" />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 80 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          playList(episodeList, index + lattestEpisodes.length)
                        }
                      >
                        <img src="/play-green.svg" alt="Tocar episodio" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
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
      url: episode.file.url,
    };
  });

  const lattestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      lattestEpisodes: lattestEpisodes,
      allEpisodes: allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
