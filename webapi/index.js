const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { User, McServer } = require("./models");
const fetch = require("node-fetch");
const { text } = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

var likeips = [];

app.post("/serverlist", async(req, res) => {
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

app.post("/addlike", async(req, res) => {
    var { serverip, likes } = req.body;
    var today = new Date().toISOString().split("T")[0];
    serverip = serverip.trim();
    var clientip = req.connection.remoteAddress.replace("::ffff:", "");
    const existingLike = await User.findAll({
        where: {
            serverip,
            clientip,
        },
        order: [
            ["updatedAT", "DESC"]
        ],
    });
    if (existingLike != "") {
        const test = existingLike.map((test) => {
            if (test.date != today) {
                User.update({ date: new Date() }, { where: { serverip, clientip } });
                McServer.update({ likes: likes + 1 }, { where: { ip: serverip } });
            } else {
                return "JUŻ DAŁES DZISIAJ LIKE!";
            }
        });
        console.log(test);
    } else {
        await User.create({
            clientip,
            serverip,
            date: new Date(),
        });
        await McServer.update({ likes: likes + 1 }, { where: { ip: serverip } });
    }
});
app.get("/clientlikes", async(req, res) => {
    var clientip = req.connection.remoteAddress.replace("::ffff:", "");
    const clientlikes = await User.findAll({
        where: {
            clientip,
        },
    });
    const allclientlikes = clientlikes.map((allclientlikes) => {
        return {
            id: allclientlikes.id,
            clientip: allclientlikes.clientip,
            serverip: allclientlikes.serverip,
            date: allclientlikes.date,
        };
    });

    res.json(allclientlikes);
});

app.get("/serverlist", async(req, res) => {
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
            domain: server.domain,
            likes: server.likes,
            premium: premiumDaysLeft,
            tags: (server.tags && server.tags.split(",")) || "",
        };
    });

    res.json(servers);
});

app.get("/theserver", async(req, res) => {
    const ip = req.query.server;
    console.log(ip);
    const serverModels = await McServer.findAll({
        where: {
            ip,
        },
    });
    const servers = serverModels.map((server) => {
        const day = 1000 * 60 * 60 * 24;

        const now = new Date();
        const premiumUntil = server.premium || now;

        const premiumDaysLeft = Math.floor((premiumUntil - now) / day);

        return {
            id: server.id,
            name: server.ip,
            domain: server.domain,
            likes: server.likes,
            premium: premiumDaysLeft,
            tags: (server.tags && server.tags.split(",")) || "",
        };
    });

    res.json(servers);
});

const httpServer = http.createServer(app);

const httpsServer = https.createServer({
        key: fs.readFileSync("./ssl/private.key"),
        cert: fs.readFileSync("./ssl/certificate.crt"),
    },
    app
);

httpServer.listen(23826, () => console.log("Listening HTTP..."));
httpsServer.listen(23827, () => console.log("Listening HTTPS..."));