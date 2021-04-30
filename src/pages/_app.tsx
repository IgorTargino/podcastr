import { useEffect } from "react";
import Header from "../components/Header";
import Player from "../components/Pĺayer";

import { PlayerContextProvider } from "../context/PlayerContext";
import { ThemeContextProvider } from "../context/ThemeContext";

import styles from "../styles/app.module.scss";
import "../styles/global.scss";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
       navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log("Service Worker registration successful with scope: ", registration.scope);
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, [])

  return (
    <ThemeContextProvider>
      <PlayerContextProvider>
        <div className={styles.wrapper}>
          <main>
            <Header />
            <Component {...pageProps} />
          </main>
          <Player />
        </div>
      </PlayerContextProvider>
    </ThemeContextProvider>
  );
}

export default MyApp;
