const pg = require('pg');
const { request } = require('express');
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

const getUser = () => {
    return new Promise((resolve, reject) => {

        client.query(`SELECT user_name, status FROM users ORDER BY username_id DESC LIMIT 20`)
          .then((result) => {
            let data = result.rows;
            resolve(data);
          })
          .catch((e) => console.error(e.stack));
    })
}


const status = (request) => {
  const data = request;

  client.query(`UPDATE users SET status = '${data.status}' WHERE user_name = '${data.username}'`,
    (error, result) => {
      if (error) {
        throw error;
      }
    })
}


const checkUser = (request) => {
  const data = request;
  return new Promise((resolve, reject) => {
    client.query(`SELECT user_name FROM users`)
      .then((results) => {
        const result = results.rows;
        if (result.some(user => user.user_name == data) || data == '') {
          resolve(false);
        } else {
          resolve(true);
        }

        resolve(data);
      })
      .catch((e) => console.error(e.stack));
  })
}

const insertUser = (request) => {
  const data = request;
  client.query(
    "INSERT INTO users (user_name, status) VALUES ($1, $2)",
    [data.user, data.status], (error, result) => {
      if (error) {
        throw error;
      }
    }
  );
};

const deleteUser = (request) => {
  const data = request;

  client.query(`DELETE FROM users WHERE user_name = '${data}'`,
    (error, result) => {
      if (error) {
        throw error;
      }
    });
}


module.exports = {
    getChat,
    insertChat,
    getUser,
    insertUser,
    checkUser,
    deleteUser,
    status
}
