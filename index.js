// Run express instant
const app = require('express')();
//Maakt server aan
const server =  require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
})

// Als je request aanvraagd return hij de index
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

// Namespace voor chatrooms
const tech = io.of('/tech');

// Als er een event is
tech.on("connection", (socket) => {
    console.log("user connected");
    socket.on("message", (msg) => {
        console.log(`message: ${msg}`);
        tech.emit("message", msg);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
        tech.emit("message", "User disconnected");
    });
});