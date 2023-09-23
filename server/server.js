const fs = require("fs");
const https = require("https");

const express = require("express");
const fileUpload = require("express-fileupload");

const path = require("path");
const app = express();

const io = require("socket.io")(8080, {
    cors: {
        origin: "*",
    },
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/upload",
    fileUpload({ createParentPath: true }),
    (req, res) => {
        const files = req.files;
        console.log(files);

        return res.json({ status: "logged", message: "logged", });
    },
);

io.on("connection", socket => {
    socket.on("message", message => {
        io.emit("message", message);
    });
});