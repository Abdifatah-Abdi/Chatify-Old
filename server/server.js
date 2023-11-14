const io = require("socket.io")(8080, {
    cors: {
        
    },
});

io.on("connection", socket => {
    console.log("Hi");
    io.emit("message", "Hi");

    socket.on("message", message => {
        io.emit("message", message);
    });
});