const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { User, McServer } = require("./models");
const fetch = require("node-fetch");
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = "very secret very secret";

// Login
app.post("/session", async (req, res) => {
  // TODO(Wojciech): input validation (wyszukaj validator w npm)

  const { username, password } = req.body;

  // zalozmy ze username i password sa poprawne
  // TODO(Wojciech): Check

  const user = await User.findOne({ where: { username } });
  if (user) {
    const token = jwt.sign({ id: user.id, username }, JWT_SECRET);
    res.json({ token });
  }
});

app.get("/create-user", async (req, res) => {
  const user = await User.create({
    username: "janedoe",
    birthday: new Date(1980, 6, 20),
  });
  res.json(user);
});

app.get("/", async (req, res) => {
  const authHeader = req.header("Authorization");
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");

    try {
      const payload = jwt.verify(token, JWT_SECRET); // wywali exception jezeli JWT nie jest poprawny

      const user = await User.findByPk(payload.id);
      res.json(user);
    } catch (error) {
      console.log("Bad bad things: ", error);
    }
  }
});

app.post("/serverlist", async (req, res) => {
  var { ip, tags } = req.body;
  ip = ip.trim();
  const existingServer = await McServer.findOne({ where: { ip } });
  if (existingServer) {
    return console.log("kest taoi");
  }
  try {
    const response = await fetch(`https://api.mcsrvstat.us/2/${ip.trim()}`, {
      method: "GET",
    });
    const exam = await response.json();
    if (exam.online == true) {
      if (!existingServer) {
        const server = await McServer.create({
          ip,
          likes: 0,
          views: 0,
        });

        res.json({ status: "bananas" });
      } else {
        res.json({ status: "already exists, bananas" });
      }
    } else {
      console.log("server offline");
    }
  } catch (error) {
    console.error(error);
  }
});

app.get("/serverlist", async (req, res) => {
  // 1. get user session
  // 2. get user data
  // 3. send that data back to the user

  const page = req.query.page > 0 || 0;
  const pageLength = 10;

  const serverModels = await McServer.findAll({
    offset: page * pageLength,
    limit: pageLength,
    order: [
      ["premium", "DESC"],
      ["likes", "DESC"],
    ],
  });
  const servers = serverModels.map((server) => {
    const day = 1000 * 60 * 60 * 24;

    const now = new Date();
    const premiumUntil = server.premium || now;

    const premiumDaysLeft = Math.floor((premiumUntil - now) / day);

    return {
      id: server.id,
      name: server.ip,
      likes: server.likes,
      views: server.views,
      premium: premiumDaysLeft,
      tags: (server.tags && server.tags.split(",")) || "",
    };
  });

  res.json(servers);
});

app.listen(5555);
