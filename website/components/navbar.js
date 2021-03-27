import styles from "../styles/Home.module.css";
import Link from "next/link";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { useState } from "react";
import useSWR from "swr";

export default function Mnav() {
  return (
    <div className={styles.navbar}>
      <Navbar bg="light" className={styles.nav}>
        <Navbar.Brand>
          <a href="/">RichList</a>
        </Navbar.Brand>
        <Nav className="mr-auto">
          <span className={styles.navlink}>
            <a href="/">Strona Główna</a>
          </span>
          <span className={styles.navlink}>
            <Link href="/addserver">Dodaj Serwer</Link>
          </span>
        </Nav>
      </Navbar>
    </div>
  );
}
