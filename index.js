// Run express instant
const app = require('express')();
//Maakt server aan
const server =  require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const db = require('./queries');;

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
})

// Als je request aanvraagd return hij de index
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html')
});

app.get('/swift', (req, res) => {
    res.sendFile(__dirname + '/public/swift.html')
});

app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/public/css.html')
});

// Namespace voor chatrooms
const tech = io.of('/tech');

// Als er een event is
tech.on("connection", (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);

        let test = db.getChat;

        console.log(test)
        
        tech.in(data.room).emit('message', `New user joined ${data.room} room`);
    })

    socket.on("message", (data) => {
        console.log(`message: ${data.msg}`);

        var message = {
            name: "Hans",
            room: data.room,
            text: data.msg
        }

        let insert = db.insertChat(message);
        console.log(data);
        tech.in(data.room).emit("message", `${message.name}: ${data.msg}`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
        tech.emit("message", "User disconnected");
    });
});
