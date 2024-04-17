"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Matrix } from "@/Components/Matrix";

export default function Home() {
  return (
    <main>
      <Matrix></Matrix>
    </main>
  );
}
