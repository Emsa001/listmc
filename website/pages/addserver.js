import styles from "../styles/Home.module.css";
import Link from "next/link";
import Mnav from "../components/navbar";
import { useState } from "react";
import { API_URL } from "../config";
import useSWR from "swr";
import "bootstrap/dist/css/bootstrap.min.css";
//components
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export default function AddServer() {
  const { mutate } = useSWR(`${API_URL}/serverlist`);
  const [serverName, setServerName] = useState(" ");

  const onAddServer = async (e) => {
    e.preventDefault(); // dost shalt not submit

    if (serverName.length > 3) {
      window.location.replace(`server?server=${serverName.toLowerCase()}`);
    }
    await fetch(`${API_URL}/serverlist`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ip: serverName.toLowerCase(),
      }),
    });
    mutate(null); // wymus natychmiastowe odswierzenie listy
  };

  return (
    <div className={styles.content}>
      <Mnav />
      <Container className={`servercontainer ${styles.container}`}>
        <Row>
          <Col className={`addform`}>
            <h1>Dodaj serwer miencraft na liste</h1>
            <p>
              Serwery duplikowane, bądź serwery offline są automatycznie
              odrzucane.
            </p>
            <Form onSubmit={(e) => onAddServer(e)}>
              <Form.Row>
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>Adres serwera</Form.Label>
                  <Form.Control
                    placeholder="mcserver.pl"
                    value={serverName.trim()}
                    onChange={(event) => setServerName(event.target.value)}
                  />
                </Form.Group>
              </Form.Row>
              <Button variant="primary" type="submit">
                Dodaj serwer na liste
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
