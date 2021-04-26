import React from "react";
import Link from "next/link";
import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";
import { FaMoon, FaSun } from 'react-icons/fa';

import styles from "./styles.module.scss";
import { useTheme } from "../../context/ThemeContext";

const Header = () => {  
  const { toggleDarkMode, isDark } = useTheme();

  const currentDate = format(new Date(), "EEEEEE, d MMMM", {
    locale: ptBR,
  });

  return (
    <header className={styles.container}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="Podcastr" />
        </a>
      </Link>
      <div className={styles.secondaryContainer}>
        <p>O melhor para você ouvir, sempre</p>
        <div className={styles.data}>
          <button type="button" onClick={toggleDarkMode} >
            {isDark ? <FaMoon /> : <FaSun />}
          </button>
          <span>{currentDate}</span>
        </div>

      </div>
    </header>
  );
};

export default Header;
