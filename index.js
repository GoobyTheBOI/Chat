// Run express instant
const express = require('express');;
const app =express();
//Maakt server aan
const server =  require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const db = require('./queries');

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

app.use(express.static('public'));

// Als je request aanvraagd return hij de index
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/chatroom.html')
});

app.get('/swift', (req, res) => {
    res.sendFile(__dirname + '/public/chatroom.html')
});

app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/public/chatroom.html')
});

app.get('/users', (req, res) => {
    res.sendFile(__dirname + '/public/users.html')
});

app.get('/chatrooms', (req, res) => {
    res.sendFile(__dirname + '/public/chatroom.html')
});

// Namespace voor chatrooms
const tech = io.of('/tech');


// Als er een event is
tech.on("connection", (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        socket.join(data.users);

        db.getChat(data.room).then(val => {
            tech.to(socket.id).emit('historyMessage', val);
        })
        
        db.getUser(data.users).then(() => {
            tech.to(socket.id).emit('users', [{user: data.users}]);
        })
    });

    socket.on("singleMessage", (data) => {

        var message = {
            name: `${data.username}`,
            room: data.rooms,
            text: data.msg
        }
        let insert = db.insertChat(message);
        // tech.in(data.rooms).emit("message", `${message.name}: ${data.msg}`);
        console.log(data)
        tech.in(data.rooms).emit("singleMessage", { username: data.username, msg: data.msg, time: data.time});
    });


    socket.on("disconnect", () => {
        console.log("User disconnected");
        // tech.emit("singleMessage", "User disconnected");
    });
});
