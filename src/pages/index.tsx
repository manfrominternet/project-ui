import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Link from 'next/link'
 

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
            <p>Welcome to: for UI made movie library</p>
            <Link href="/register">Proceed to register</Link>
            <Link href="/login">Proceed to login</Link>
        </div>
      </main>
    </>
  );
}
