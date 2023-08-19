const io = require("socket.io")(8080, {
    cors: {
        origin: "*",
    },
});

io.on("connection", socket => {
    socket.on("message", message => {
        io.emit("message", message);
    });
});