const http = require('http');
const hostname = '127.0.0.1';
const sqlite3 = require("sqlite3");
const {open} = require("sqlite");
const cors = require('cors');
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
(async () => {
    const db = await open({
        filename: path.resolve(__dirname, './database/database.db'),
        driver: sqlite3.Database
    });
//users
//tables
//messages
// console.log(db)
//     app.put('/api/users/:userId/:icon/:chats', (req, res) => {
//         (async () => {
//             const userIdResult = await db.run('INSERT INTO tbl (col) VALUES (?)',
//                 req.params.tagId)
//             const iconResult = await db.run('INSERT INTO tbl (col) VALUES (?)',
//                 req.params.icon)
//             const chatsResult = await db.run('INSERT INTO tbl (col) VALUES (?)',
//                 req.params.chats)
//         })()
//     });
    app.get('/api/users', (req, res) => {
        (async () => {
            let a = await db.all('SELECT * FROM users')
            res.send(a)
        })()
    });
    app.post('/api/users', async (req, res) => {
        const { login, password } = req.body;
        console.log("got message to post");
        try {
            const user = await db.get('SELECT id FROM users WHERE login = ? AND password = ?', [login, password]);
            if (user) {
                console.log("User exists, sending existing ID");
                res.status(200).send({ lastId: user.id });
            } else {
                const { lastID } = await db.run('INSERT INTO users (login, password) VALUES (?, ?)', [login, password]);
                console.log("User created, sending new ID");
                res.status(201).send({ lastId: lastID, login: login});
            }
        } catch (err) {
            console.error("Database error: ", err.message);
            res.status(500).send({ error: 'Database error', details: err.message });
        }
    });

    app.get('/api/users/:login', (req, res) => {
        (async () => {
            let userId = req.params.login
            let a = await db.all('SELECT * FROM users WHERE login = ?', userId)
            res.send(a)
        })()
    });

    app.get('/api/messages', (req, res) => {
        (async () => {
            let a = await db.all('SELECT * FROM messages')
            res.send(a)
        })()
    });
    app.get('/api/chats', (req, res) => {
        (async () => {
            let a = await db.all('SELECT * FROM chats')
            res.send(a)
        })()
    })
    app.post('/api/chats', async (req, res) => {
        const { user1_id, user2_id, chat_name} = req.body;
        try {
            const existingChat = await db.get(`
            SELECT c.id, c.name, c.icon
            FROM chats c
            JOIN chatsToUsers ctu1 ON c.id = ctu1.idChat AND ctu1.idUser = ?
            JOIN chatsToUsers ctu2 ON c.id = ctu2.idChat AND ctu2.idUser = ?
        `, [user1_id, user2_id]);
            if (existingChat) {
                console.log("Chat already exists");
                res.status(200).send({ chat: existingChat });
            } else {
                const { lastID: newChatId } = await db.run('INSERT INTO chats (name, icon) VALUES (?, ?)', [chat_name, 'Default Icon Path']);
                await db.run('INSERT INTO chatsToUsers (idChat, idUser) VALUES (?, ?)', [newChatId, user1_id]);
                await db.run('INSERT INTO chatsToUsers (idChat, idUser) VALUES (?, ?)', [newChatId, user2_id]);
                console.log("New chat created");
                res.status(201).send({ chat: { id: newChatId, name: chat_name, icon: 'Default Icon Path' } });
            }
        } catch (err) {
            console.error("Database error: ", err.message);
            res.status(500).send({ error: 'Database error', details: err.message });
        }
    });

    app.get('/api/chats/:chatId', (req, res) => {
        (async () => {
            let a = await db.all('SELECT * FROM chats WHERE id = ?', req.params.chatId)
            res.send(a)
        })()
    })
    app.get('/api/messages/:messageId', (req, res) => {
        (async () => {
            let a = await db.all('SELECT * FROM messages WHERE id = ?', req.params.messageId)
            res.send(a)
        })()
    });
    app.post('/api/messages', async (req, res) => {
        const {chat_id, user_id, message, time} = req.body;
        try {
            await db.run('INSERT INTO messages (chatId, userId, createdAt, updatedAt, message) VALUES (?, ?, ?, ?, ?)', [chat_id, user_id,time, Date.now(), message]);
            res.status(200).send({message: message})
        } catch (err) {
            console.error("Database error: ", err.message);
            res.status(500).send({ error: 'Database error', details: err.message });
        }
    });
    app.post('/api/messages/send', async (req, res) => {
        const {chat_id} = req.body;
        try {
            let messages = await db.all('SELECT * FROM messages WHERE chatId = ?', chat_id);
            res.status(200).send({messages: messages})
        } catch (err) {
            console.error("Database error: ", err.message);
            res.status(500).send({ error: 'Database error', details: err.message });
        }
    });
    // app.put('/api/chats/:chatId', (req, res) => {
    //     (async () => {
    //         const chatIdResult = await db.run('INSERT INTO tbl (col) VALUES (?)',
    //             req.params.chatId)
    //     })()
    // });
    // app.put('/api/messages/:messageId/:chatId/:userId/:createdAt/:updatedAt', (req, res) => {
    //     (async () => {
    //         const messageIdResult = await db.run('INSERT INTO tbl (col) VALUES (?)',
    //             req.params.messageId)
    //         const chatIdResult = await db.run('INSERT INTO tbl (col) VALUES (?)',
    //             req.params.chatId)
    //         const created_at_result = await db.run('INSERT INTO tbl (col) VALUES (?)',
    //             req.params.createdAt)
    //         const updated_at_result = await db.run('INSERT INTO tbl (col) VALUES (?)',
    //             req.params.updatedAt)
    //     })()
    // });


    app.get('/api/users', (req, res) => {
        res.send('Hello World!')
    });
    app.get('/messages', (req, res) => {
        res.send('Hello')
        console.log('World')
    });
    // app.get('/addNewMessages/:tagId', (req, res) => {
    //     data.push(req.params.tagId);
    //     res.send(true)
    //     console.log(data)
    // });
    // app.get('/messages/:tagId', function (req, res) {
    //     res.send("tagId is set to " + req.params.tagId);
    //     console.log(data[req.params.tagId])
    // });
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    });
})();



//http://localhost:3000/api/users

