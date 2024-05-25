// const http = require('http');
// const hostname = '127.0.0.1';
const sqlite3 = require("sqlite3");
const {open} = require("sqlite");
const cors = require('cors');
// const path = require('path')
const express = require('express')
// const bodyParser = require('body-parser');
// const { Server } = require("socket.io");
// const { Socket } = require('dgram');
const app = express();
const server = require('http').Server(app);
const port = process.env.PORT || 3001;
let sockets = []
server.listen(port, () => {
    console.log("Connected")
})
app.use(cors());
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000'
        // origin: 'team4.ya-itmo.ru:3000'
    }
})

open({
    filename: './database/database.db',
    driver: sqlite3.Database
}).then(async (db) => {
    console.log("Database connected");
    
    app.use(express.json());

    app.get('/getAccessToken', async function (req, res) {
        const params = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + req.query.code;
        console.log("test1")
        await fetch("https://github.com/login/oauth/access_token" + params, {
          method: "POST",
          headers: {
            "Accept": "application/json"
          }
        }).then((response) => {
          return response.json();
        }).then((data) => {
          console.log(data);
          res.json(data);
        })
      })

      app.get('/getUserData', async function (req, res) {
        req.get("Authorization");
        await fetch("https://api.github.com/user", {
          method: "GET",
          headers: {
            "Authorization": req.get("Authorization")
          }
        }).then((response) => {
          return response.json();
        }).then((data) => {
          console.log(data);
          res.json(data);
        })
      })

    // Route to get all messages
    app.get('/getAllMessages', async (req, res) => {
        try {
            const messages = await db.all('SELECT * FROM messages');
            res.json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).send('Error fetching messages');
        }
    });

    // Route to create a new chat
    app.post('/createChat', async (req, res) => {
        const { name, userIds } = req.body;
        try {
            // Insert chat into chats table
            const result = await db.run(
                'INSERT INTO chats (name) VALUES (?)',
                name
            );
            const chatId = result.lastID;

            // Insert records into chatsToUsers table
            for (const userId of userIds) {
                await db.run(
                    'INSERT INTO chatsToUsers (idChat, idUser) VALUES (?, ?)',
                    [chatId, userId]
                );
            }

            res.status(201).send('Chat created successfully');
        } catch (error) {
            console.error('Error creating chat:', error);
            res.status(500).send('Error creating chat');
        }
    });

    // Route to get user by login and password
    app.get('/getUser', async (req, res) => {
        const { login, password } = req.query;
        try {
            const user = await db.get(
                'SELECT * FROM users WHERE login = ? AND password = ?',
                [login, password]
            );
            if (user) {
                res.json(user);
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).send('Error fetching user');
        }
    });

    // Route to get all chats
    app.get('/getChats', async (req, res) => {
        try {
            const chats = await db.all('SELECT * FROM chats');
            res.json(chats);
        } catch (error) {
            console.error('Error fetching chats:', error);
            res.status(500).send('Error fetching chats');
        }
    });

    // Route to delete a user
    app.delete('/deleteUser/:userId', async (req, res) => {
        const userId = req.params.userId;
        try {
            await db.run(
                'DELETE FROM users WHERE id = ?',
                userId
            );
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).send('Error deleting user');
        }
    });

    // Route to delete a chat
    app.delete('/deleteChat/:chatId', async (req, res) => {
        const chatId = req.params.chatId;
        try {
            // Delete chat from chats table
            await db.run(
                'DELETE FROM chats WHERE id = ?',
                chatId
            );

            // Delete associated records from chatsToUsers table
            await db.run(
                'DELETE FROM chatsToUsers WHERE idChat = ?',
                chatId
            );

            // Delete associated messages
            await db.run(
                'DELETE FROM messages WHERE chatId = ?',
                chatId
            );
        } catch (error) {
            console.error('Error deleting chat:', error);
            res.status(500).send('Error deleting chat');
        }
    });

    // Route to add a new user
    app.post('/addUser', async (req, res) => {
        const { login, password, icon } = req.body;
        try {
            await db.run(
                'INSERT INTO users (login, password, icon) VALUES (?, ?, ?)',
                [login, password, icon]
            );
        } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).send('Error adding user');
        }
    });

    // Route to add a new chat
    app.post('/addChat', async (req, res) => {
        const { name, icon } = req.body;
        try {
            await db.run(
                'INSERT INTO chats (name, icon) VALUES (?, ?)',
                [name, icon]
            );
        } catch (error) {
            console.error('Error adding chat:', error);
            res.status(500).send('Error adding chat');
        }
    });

    io.on('connection', socket => {
        console.log('User connected');

        sockets.push(socket)

        socket.on('chat message', async (req, res) => {
            const { chatId, userId, createdAt, updatedAt, text } = req;//THIS
            console.log(text)

            try {
                const createdAt = new Date().toISOString();
                const updatedAt = createdAt;
                await db.run(
                    'INSERT INTO messages (chatId, userId, createdAt, updatedAt, message) VALUES (?, ?, ?, ?, ?)',
                    [chatId, userId, createdAt, updatedAt, text]
                )
                const messag = await db.get(
                    'SELECT * FROM messages WHERE chatId = ? AND userId = ? AND createdAt = ? AND updatedAt = ? AND message = ?',
                    [chatId, userId, createdAt, updatedAt, text]
                );
                for (const socke of sockets) {//todo создать инстанс в бд, возвращать созданную строку
                    socket.emit('chat message', messag)
                }
            } catch (error) {
                console.error('Error sending message:', error);
                res.status(500).send('Error sending message');
            }
        });

        // socket.on('update message', async message => {
        //     const { text, messageId } = req.body;
        //     try {
        //         const updatedAt = new Date().toISOString();
        //         await db.run(
        //             'UPDATE messages SET message = ? WHERE id = ? SET updatedAt = ?',
        //             [text, messageId, updatedAt]
        //         )
        //         const messag = await db.get(
        //             'SELECT * FROM messages WHERE message = ? WHERE id = ? SET updatedAt = ?',
        //             [text, messageId, updatedAt]
        //         );
        //         for (const socke of sockets) {//todo создать инстанс в бд, возвращать созданную строку
        //             socket.emit('update message', messag)
        //         }
                
        //     } catch (error) {
        //         console.error('Error sending message:', error);
        //         res.status(500).send('Error sending message');
        //     }
        // });        

        // //todo
        // socket.on('delete message', async message => {
        //     const { messageId } = req.body;
        //     try {
        //         await db.run(
        //             'DELETE FROM messages WHERE id = ?',
        //                 messageId
        //         )
        //         // socket.emit('chat message', message)
        //     } catch (error) {
        //         console.error('Error sending message:', error);
        //         res.status(500).send('Error sending message');
        //     }
        // });

        socket.on('disconnect', () => {
            console.log('User disconnected');
            sockets = sockets.filter(s => s !== socket)
        });
    });
}).catch(error => {
    console.error('Error connecting to database:', error);
});

function createUser(username, password) { //todo Implement hashing of the password
    const hashedPassword = bcrypt.hashSync(password, 10); // 10 is the saltRounds
    
    db.run('INSERT INTO users (username, hashed_password) VALUES (?, ?)', [username, hashedPassword], function(err) {
        if (err) {
            console.error('Error creating user:', err.message);
        } else {
            console.log('User created successfully');
        }
    });
}

function verifyPassword(username, password, callback) {
    db.get('SELECT hashed_password FROM users WHERE username = ?', [username], function(err, row) {
        if (err) {
            callback(err);
        } else if (!row) {
            callback(null, false); // User not found
        } else {
            const hashedPassword = row.hashed_password;
            callback(null, bcrypt.compareSync(password, hashedPassword));
        }
    });
}
async function addImageToDatabase(userId, messageId, imagePath) {
    let image = fs.readFileSync(imagePath);
    await db.run('INSERT INTO message_images (userId, messageId, image) VALUES (?, ?, ?)', [userId, messageId, image], function(err) {
      if (err) {
        return console.log(err.message);
      }
    //   console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
  }


//http://localhost:3000/api/users

