import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import "bootstrap/dist/css/bootstrap.min.css";
//components
import Mnav from "../components/navbar";
import { FaSignal, FaGem } from "react-icons/fa";
import { OverlayTrigger, Tooltip, Pagination } from "react-bootstrap";
import { useState } from "react";
import { API_URL } from "./config";

function ServerMC({ id, name, domain, likes, premium }) {
  const { data } = useSWR(`${API_URL}/${name}`);
  var ispremium = "";
  if (premium == 1) {
    ispremium = "serverpremium";
  }
  return (
    <Link
      href={
        (data?.online && {
          pathname: "/server",
          query: { server: name, page: 1 },
        }) ||
        "#"
      }
    >
      <div className={`${styles.container} ${styles.servercontainer}`}>
        <div className={styles.serverfooter}>
          <p>
            {(premium > 0 && (
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id={`tooltip-left`}>
                    <strong>Serwer Premium</strong>.
                  </Tooltip>
                }
              >
                <p>⭐⭐⭐</p>
              </OverlayTrigger>
            )) ||
              ""}
          </p>
        </div>
        <div className={styles.servericon}>
          <img
            src={
              data?.icon ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpjIXaMIPbXBm9wEQJUsIUssNmcP1TfXxXrQ&usqp=CAU"
            }
          />
        </div>
        <div className={styles.servername}>
          <h4>
            {(premium > 0 && (
              <strong>
                {(domain.length > 3 && domain) ||
                  name.charAt(0).toUpperCase() + name.slice(1) ||
                  "Ładowanie..."}
              </strong>
            )) ||
              (domain.length > 3 && domain) ||
              name.charAt(0).toUpperCase() + name.slice(1) ||
              "Ładowanie..."}
          </h4>
          <span>
            {data?.version?.replace(/&gt;/g, "").replace("§x", "") || "OFFLINE"}
          </span>
        </div>
        <div className={styles.serverdes}>
          <span
            dangerouslySetInnerHTML={{
              __html: data?.motd?.html[0] || "OFFLINE",
            }}
          />
          <br />
          <span
            dangerouslySetInnerHTML={{
              __html: data?.motd?.html[1] || "",
            }}
          />
        </div>
        <div
          className={
            (premium > 0 && `${styles.serverstat} ${styles.statspremium}`) ||
            styles.serverstat
          }
        >
          <span className={styles.mark}>
            {data?.players?.online || "0"}/{data?.players?.max || "0"}{" "}
            <FaSignal />
            <br />
            <span>{likes}</span> <FaGem />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [page, setPage] = useState(0);
  const { data } = useSWR(`${API_URL}/serverlist?page=${page}`);
  return (
    <div className={styles.content}>
      <Head>
        <title>RichmcList.pl</title>
        <link rel="icon" href="/icon.png" />
      </Head>
      <Mnav />
      <br />
      <br />
      {data &&
        data.map((data, index) => (
          <ServerMC
            key={index}
            id={data?.id}
            name={data?.name}
            domain={data?.domain}
            likes={data?.likes}
            premium={data?.premium}
          />
        ))}
      <div className={styles.pagelist}>
        <Pagination>
          {page > data?.length / 10 && (
            <Pagination.Prev
              onClick={() => setPage((page > 0 && page - 1) || 0)}
            />
          )}
          <Pagination.Item>{page + 1}</Pagination.Item>
          {page < data?.length / 10 && (
            <Pagination.Next onClick={() => setPage(page + 1)} />
          )}
        </Pagination>
      </div>

      <footer className={styles.footer}>
        <a href="#" rel="noopener noreferrer">
          Created by Emsa001
          <img src="https://i.imgur.com/JhpqS1m.png" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
