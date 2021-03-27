import useSWR from "swr";
import styles from "../styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Mnav from "../components/navbar";
import {
  OverlayTrigger,
  Tooltip,
  Form,
  Button,
  Col,
  Row,
} from "react-bootstrap";
import {
  FaSignal,
  FaGamepad,
  FaGem,
  FaGlobe,
  FaEye,
  FaCreditCard,
  FaCcStripe,
  FaCcPaypal,
} from "react-icons/fa";
import { API_URL } from "../config";
import { useRouter } from "next/router";
import React, { useState } from "react";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import RangeSlider from "react-bootstrap-range-slider";

export default function addlike() {
  var skins = [];
  var likes;
  var lastlikes;
  var tags = "";
  var domain;
  var premium;
  const router = useRouter();
  if (router.query.server) {
    const { data: server } = useSWR(
      `https://api.mcsrvstat.us/2/${router.query.server}`
    );

    const likeserwer = async (e) => {
      e.preventDefault();
      location.reload();
      await fetch(`${API_URL}/addlike`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serverip: router.query.server,
          likes: likes,
        }),
      });
    };

    for (var i = 0; i < server?.players?.list?.length && i < 28; i++) {
      let link = `https://minotar.net/avatar/${server.players.list[i]}`;
      skins.push(
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id={`tooltip-left`}>
              <strong>{server.players.list[i]}</strong>
            </Tooltip>
          }
        >
          <img src={link} width="30px" className={styles.avatar} />
        </OverlayTrigger>
      );
    }
    const { data: serverdata } = useSWR(
      `${API_URL}/theserver?server=${router.query.server}`
    );
    const { data: clientlikes } = useSWR(`${API_URL}/clientlikes`);
    serverdata?.filter(function (item) {
      if (item.name == router.query.server) {
        domain = item.domain;
        likes = item.likes;
        premium = item.premium;
        for (var x = 0; x < item.tags.length; x++) {
          tags = tags + `<span>${item.tags[x]}</span>`;
        }
      }
    });
    clientlikes?.filter(function (likes) {
      if (likes.serverip == router.query.server) {
        lastlikes = likes.date;
      }
    });

    const SliderWithInputFormControl = () => {
      const [value, setValue] = React.useState(15);

      return (
        <Form>
          <Form.Group as={Row}>
            <Col xs="12">
              <h5>
                Liczba dni: <b>{value}</b>
              </h5>
              <RangeSlider
                value={value}
                onChange={(e) => setValue(e.target.value)}
                min={2}
                max={90}
                tooltipPlacement="top"
              />
              <h5>
                Koszt: <b>{value * 2} PLN</b>
              </h5>
            </Col>
          </Form.Group>
        </Form>
      );
    };

    return (
      <div className={styles.content}>
        <Mnav />
        <div className={styles.serverlookupdiv}>
          <div className={styles.serverlookupleft}>
            <div className={styles.openservercon}>
              <div className={styles.serverlookouticon}>
                <img
                  src={
                    server?.icon ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpjIXaMIPbXBm9wEQJUsIUssNmcP1TfXxXrQ&usqp=CAU"
                  }
                />
              </div>
              <h4 className={styles.servertitle}>
                {(premium && (
                  <strong>
                    ⭐
                    {domain ||
                      router.query.server.charAt(0).toUpperCase() +
                        router.query.server.slice(1) ||
                      "Ładowanie..."}
                    ⭐
                  </strong>
                )) ||
                  domain ||
                  router.query.server.charAt(0).toUpperCase() +
                    router.query.server.slice(1) ||
                  "Ładowanie..."}
              </h4>
              <hr />
              <div className={styles.lookupservermotd}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: server?.motd?.html[0] || "OFFLINE",
                  }}
                />
                <br />
                <span
                  dangerouslySetInnerHTML={{
                    __html: server?.motd?.html[1] || "",
                  }}
                />
              </div>
              <hr />
              <div className={styles.srvertags}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: tags || "",
                  }}
                />
              </div>
            </div>
          </div>
          <div className={styles.rightwidget}>
            <div className={styles.servrightwidget}>
              <h3>Informacje</h3>
              <hr />
              <p>
                <FaSignal /> <b>Gracze:</b> {server?.players?.online} /{" "}
                {server?.players?.max}
                <br />
                <FaGlobe /> <b>Ip:</b> {router.query.server}
                <br />
                <FaGamepad /> <b>Wersja:</b>{" "}
                {server?.version?.replace(/&gt;/g, "").replace("§x", "") ||
                  "---"}
                <br />
                <FaGem /> <b>Polubienia:</b> {likes} <br />
              </p>
              <Button
                variant="outline-primary"
                type="submit"
                onClick={(e) => likeserwer(e)}
              >
                {(server?.online &&
                  lastlikes == new Date().toISOString().split("T")[0] &&
                  `Dałeś już like`) ||
                  "Daj like"}
              </Button>
              <hr />
            </div>
            <div className={styles.servrightwidget}>
              <h3>Lista Graczy:</h3>
              <hr />
              <p className={styles.playerslookup}>
                {skins} {(skins.length > 0 && <hr />) || ""}
              </p>
            </div>
          </div>
        </div>
        {(premium > 0 && (
          <div className={styles.buypremium}>
            <h3>
              ⭐ Serwer <b> PREMIUM ⭐</b> <br />
            </h3>
            <hr />
            <p>Ten serwer ma status premium</p>
            <h5>
              Pozostało dni premium:
              {(premium > 9999 && <b> Na zawsze</b>) || <b> {premium}</b>}
              <hr />
            </h5>
          </div>
        )) || (
          <div className={styles.buypremium}>
            <p>
              TRWAJĄ PRACE TECHNICZNE NAD PŁATNOŚCIAMI
              <br />
              JEŚLI CHCESZ KUPIĆ PREMIUM TERAZ NAPISZ <b>Emsa001#0747</b>
              <br />
              <a href="https://discord.gg/eg2QWmHPSw" target="_blank">
                https://discord.gg/eg2QWmHPSw
              </a>
            </p>
            <hr />
            <h3>
              Kup <b>PREMIUM</b> <br />
              temu serwerowi
            </h3>
            <hr />
            <p>
              Kupując usługi na naszej stronie akceptujesz{" "}
              <a href="#">regulamin płatności.</a>
            </p>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Adres email</Form.Label>
                <Form.Control type="email" placeholder="wprowadź adres email" />
                <Form.Text className="text-muted">
                  Nikomu nie odostępniamy wprowadonych przez ciebie danych
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formBasicRangeCustom">
                <SliderWithInputFormControl />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className={styles.paymentbtn}
              >
                <FaCcStripe /> Stripe
              </Button>
              <Button
                variant="primary"
                type="submit"
                className={styles.paymentbtn}
              >
                <FaCcPaypal /> PayPal
              </Button>
              <Button
                variant="primary"
                type="submit"
                className={styles.paymentbtn}
              >
                <FaCreditCard /> Karta
              </Button>
            </Form>
          </div>
        )}
        <footer className={styles.footer}>
          <a href="#" rel="noopener noreferrer">
            Created by Emsa001
            <img
              src="https://i.imgur.com/JhpqS1m.png"
              className={styles.logo}
            />
          </a>
        </footer>
      </div>
    );
  } else {
    return true;
  }
}
