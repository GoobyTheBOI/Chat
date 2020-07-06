// Run express instant
const express = require('express');;
const app = express();
//Maakt server aan
const server =  require('http').Server(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;
const router = express.Router();
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require('./queries');
var sess;

server.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

app.use(express.static('public'));
app.use(session({secret: 'ssshhhhh', resave: true, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


app.set("views", "./");
app.set("view engine", "ejs");

// Als je request aanvraagd return hij de index
router.post("/login", (req, res) => {
    sess = req.session
    sess.username = req.body.user
    res.end('done')
});

router.get('/', (req, res) => {
    res.render('/public/index.html')
});

router.get('/javascript', (req, res) => {
    sess = req.session;

    sess.reload(function (err) {
      if (sess.username) {
        res.render("public/chatroom.ejs", { name: sess.username });
      } else {
        res.sendFile(__dirname + "/public/index.html");
      }
    });
});

router.get('/swift', (req, res) => {
    sess = req.session;

    sess.reload(function (err) {
      if (sess.username) {
        res.render("public/chatroom.ejs", { name: sess.username });
      } else {
        res.sendFile(__dirname + "/public/index.html");
      }
    });
});

router.get('/css', (req, res) => {
    sess = req.session;
    sess.reload(function (err) {
      if (sess.username) {
        res.render("public/chatroom.ejs", { name: sess.username });
      } else {
        res.sendFile(__dirname + "/public/index.html");
      }
    });
});

router.get('/users', (req, res) => {
    sess = req.session;

    sess.reload(function (err) {
      if (sess.username) {
        res.render("public/users.ejs", { name: sess.username });
      } else {
        res.sendFile(__dirname + "/public/index.html");
      }
    });
});

router.get('/chatrooms', (req, res) => {
    sess = req.session;
    sess.reload(function (err) {
        if(sess.username){
            res.render("public/chatroom.ejs", { name: sess.username });
        }else{
            res.sendFile(__dirname + "/public/index.html");
        }
    });
});

router.get("/logout", (req, res) => {
  sess = req.session;
  sess.destroy((err) => {
    if (err) {
      return console.log(err);
    }else{
      db.deleteUser(sess.username)
      res.redirect("/");
    }
  });
});

// Namespace voor chatrooms
const tech = io.of('/tech');


// Als er een event is
tech.on("connection", (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        socket.join(data.users);

        db.getUser().then(val => {
            socket.emit("allUser", val)
        })

        db.getChat(data.room).then(val => {
            tech.to(socket.id).emit('historyMessage', val);
        })
        

    });

    socket.on("userName", (data) => {
      console.log(data)
        db.checkUser(data.user).then(val => {
            socket.emit("userCheck", val)

            if (val == true) {
                db.insertUser(data)
            }
        })
        
    });

    socket.on('status', (data) => {
      console.log(data)
      db.status(data)
    })

    socket.on("singleMessage", (data) => {
        // console.log(data)
        var message = {
            name: `${data.username}`,
            room: data.rooms,
            text: data.msg
        }
        db.insertChat(message);
        // console.log(data.username)
        // tech.in(data.rooms).emit("message", `${message.name}: ${data.msg}`);
        tech.in(data.rooms).emit("singleMessage", { username: data.username, msg: data.msg, time: data.time});
    });



    socket.on("disconnect", () => {
        console.log("User disconnected");
        // tech.emit("singleMessage", "User disconnected");
    });
});

app.use("/", router);
