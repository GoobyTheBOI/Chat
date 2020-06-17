const pg = require('pg');
const process_db = require("dotenv").config();
const db_url = process.env.DATABASE_URL || process_db.parsed.DB_URL;
const client = new pg.Client({
    connectionString: db_url,
    ssl: {rejectUnauthorized: false}
});

client.connect();


const insertChat = (request) => {
    const data = request;
    client.query("INSERT INTO chats (user_name, room, chat_text, date_time) VALUES ($1, $2, $3, NOW())",
    [data.name, data.room, data.text], (error, result) => {
        if(error){
            throw error;
        }
        console.log(`Chat added to Room: ${data.room}`);
    });
}

const getChat = (roomName) => {
    
        return new Promise((resolve, reject) => {

        client.query(`SELECT * FROM chats WHERE room = '${roomName}' ORDER BY date_time DESC LIMIT 20`)
        .then((result) => {
            let data = result.rows;
            resolve(data);
        })
        .catch((e) => console.error(e.stack));
    })
}

const getUser = (user) => {
    return new Promise((resolve, reject) => {

        client.query(`SELECT * FROM chats WHERE user_name = '${user}' ORDER BY date_time ASC LIMIT 20`)
            .then((result) => {
                let data = result.rows;
                resolve(data);
            })
            .catch((e) => console.error(e.stack));
    })
}


module.exports = {
    getChat,
    insertChat,
    getUser
}