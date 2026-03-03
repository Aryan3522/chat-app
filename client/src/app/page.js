"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { HomeMain } from "./components/Home/HomeMain";

export default function Home() {
  return (
    <div className="bg-dark" style={{width:"100%",height:"100vh"}}>
      <HomeMain/>
    </div>
  );
}
