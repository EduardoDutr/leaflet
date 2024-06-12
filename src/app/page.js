'use client'

import Image from "next/image";
import styles from "./page.module.css";

import Mapa from "./map/mapa"

export default function Home() {
  return (
    <div>
      <Mapa />
    </div>

  );
}
