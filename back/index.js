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
const sockets = []
server.listen(port, () => {
    console.log("Connected")
})
app.use(cors());
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})
open({
    filename: './database/database.db',
    driver: sqlite3.Database
}).then(async (db) => {
    console.log("Database connected");
    
    app.use(express.json());

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

        socket.on('chat message', async message => {
            socket.emit('chat message', message);
            console.log(message)
            // const { chatId, userId, text } = req.body;
            // try {
            //     const createdAt = new Date().toISOString();
            //     const updatedAt = createdAt;
            //     await db.run(
            //         'INSERT INTO messages (chatId, userId, createdAt, updatedAt, message) VALUES (?, ?, ?, ?, ?)',
            //         [chatId, userId, createdAt, updatedAt, text]
            //     )
            //     socket.emit('chat message', message)
            // } catch (error) {
            //     console.error('Error sending message:', error);
            //     res.status(500).send('Error sending message');
            // }
        });

        socket.on('update message', async message => {
            const { text, messageId } = req.body;
            try {
                const updatedAt = new Date().toISOString();
                await db.run(
                    'UPDATE messages SET message = ? WHERE id = ? SET updatedAt = ?',
                    [text, messageId, updatedAt]
                )
                socket.emit('chat message', message)
            } catch (error) {
                console.error('Error sending message:', error);
                res.status(500).send('Error sending message');
            }
        });        

        //todo
        socket.on('delete message', async message => {
            const { messageId } = req.body;
            try {
                await db.run(
                    'DELETE FROM messages WHERE id = ?',
                        messageId
                )
                // socket.emit('chat message', message)
            } catch (error) {
                console.error('Error sending message:', error);
                res.status(500).send('Error sending message');
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
            sockets.delete(socket)
        });
    });
}).catch(error => {
    console.error('Error connecting to database:', error);
});
// io.on('connection', socket => {
//     console.log('User connected')

//     socket.on('chat message', message => {
//         io.emit('chat message', message)
//       })

//     socket.on('disconnect', () => {
//         console.log('User disconnected')
//     })
// })






// const port = 3001;
// app.use(cors({
//     origin: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());
// (async () => {
//     const db = await open({
//         filename: path.resolve(__dirname, './database/database.db'),
//         driver: sqlite3.Database
//     });
// //users
// //tables
// //messages
// // console.log(db)
// //     app.put('/api/users/:userId/:icon/:chats', (req, res) => {
// //         (async () => {
// //             const userIdResult = await db.run('INSERT INTO tbl (col) VALUES (?)',
// //                 req.params.tagId)
// //             const iconResult = await db.run('INSERT INTO tbl (col) VALUES (?)',
// //                 req.params.icon)
// //             const chatsResult = await db.run('INSERT INTO tbl (col) VALUES (?)',
// //                 req.params.chats)
// //         })()
// //     });
//     app.get('/api/users', (req, res) => {
//         (async () => {
//             let a = await db.all('SELECT * FROM users')
//             res.send(a)
//         })()
//     });
//     app.post('/api/users', async (req, res) => {
//         const { login, password } = req.body;
//         console.log("got message to post");
//         try {
//             const user = await db.get('SELECT id FROM users WHERE login = ? AND password = ?', [login, password]);
//             if (user) {
//                 console.log("User exists, sending existing ID");
//                 res.status(200).send({ lastId: user.id });
//             } else {
//                 const { lastID } = await db.run('INSERT INTO users (login, password) VALUES (?, ?)', [login, password]);
//                 console.log("User created, sending new ID");
//                 res.status(201).send({ lastId: lastID });
//             }
//         } catch (err) {
//             console.error("Database error: ", err.message);
//             res.status(500).send({ error: 'Database error', details: err.message });
//         }
//     });

//     app.get('/api/users/:login', (req, res) => {
//         (async () => {
//             let userId = req.params.login
//             let a = await db.all('SELECT * FROM users WHERE login = ?', userId)
//             res.send(a)
//         })()
//     });

//     app.get('/api/messages', (req, res) => {
//         (async () => {
//             let a = await db.all('SELECT * FROM messages')
//             res.send(a)
//         })()
//     });
//     app.get('/api/chats', (req, res) => {
//         (async () => {
//             let a = await db.all('SELECT * FROM chats')
//             res.send(a)
//         })()
//     })
//     app.post('/api/chats', async (req, res) => {
//         const { user1_id, user2_id, chat_name} = req.body;
//         try {
//             const existingChat = await db.get(`
//             SELECT c.id, c.name, c.icon
//             FROM chats c
//             JOIN chatsToUsers ctu1 ON c.id = ctu1.idChat AND ctu1.idUser = ?
//             JOIN chatsToUsers ctu2 ON c.id = ctu2.idChat AND ctu2.idUser = ?
//         `, [user1_id, user2_id]);
//             if (existingChat) {
//                 console.log("Chat already exists");
//                 res.status(200).send({ chat: existingChat });
//             } else {
//                 const { lastID: newChatId } = await db.run('INSERT INTO chats (name, icon) VALUES (?, ?)', [chat_name, 'Default Icon Path']);
//                 await db.run('INSERT INTO chatsToUsers (idChat, idUser) VALUES (?, ?)', [newChatId, user1_id]);
//                 await db.run('INSERT INTO chatsToUsers (idChat, idUser) VALUES (?, ?)', [newChatId, user2_id]);
//                 console.log("New chat created");
//                 res.status(201).send({ chat: { id: newChatId, name: chat_name, icon: 'Default Icon Path' } });
//             }
//         } catch (err) {
//             console.error("Database error: ", err.message);
//             res.status(500).send({ error: 'Database error', details: err.message });
//         }
//     });

//     app.get('/api/chats/:chatId', (req, res) => {
//         (async () => {
//             let a = await db.all('SELECT * FROM chats WHERE id = ?', req.params.chatId)
//             res.send(a)
//         })()
//     })
//     app.get('/api/messages/:messageId', (req, res) => {
//         (async () => {
//             let a = await db.all('SELECT * FROM messages WHERE id = ?', req.params.messageId)
//             res.send(a)
//         })()
//     });
//     app.post('/api/messages', async (req, res) => {
//         const {chat_id, user_id, message, time} = req.body;
//         try {
//             await db.run('INSERT INTO messages (chatId, userId, createdAt, updatedAt, message) VALUES (?, ?, ?, ?, ?)', [chat_id, user_id,time, Date.now(), message]);
//             res.status(200).send({message: message})
//         } catch (err) {
//             console.error("Database error: ", err.message);
//             res.status(500).send({ error: 'Database error', details: err.message });
//         }
//     });
//     app.post('/api/messages/send', async (req, res) => {
//         const {chat_id} = req.body;
//         try {
//             let messages = await db.all('SELECT * FROM messages WHERE chatId = ?', chat_id);
//             res.status(200).send({messages: messages})
//         } catch (err) {
//             console.error("Database error: ", err.message);
//             res.status(500).send({ error: 'Database error', details: err.message });
//         }
//     });
//     // app.put('/api/chats/:chatId', (req, res) => {
//     //     (async () => {
//     //         const chatIdResult = await db.run('INSERT INTO tbl (col) VALUES (?)',
//     //             req.params.chatId)
//     //     })()
//     // });
//     // app.put('/api/messages/:messageId/:chatId/:userId/:createdAt/:updatedAt', (req, res) => {
//     //     (async () => {
//     //         const messageIdResult = await db.run('INSERT INTO tbl (col) VALUES (?)',
//     //             req.params.messageId)
//     //         const chatIdResult = await db.run('INSERT INTO tbl (col) VALUES (?)',
//     //             req.params.chatId)
//     //         const created_at_result = await db.run('INSERT INTO tbl (col) VALUES (?)',
//     //             req.params.createdAt)
//     //         const updated_at_result = await db.run('INSERT INTO tbl (col) VALUES (?)',
//     //             req.params.updatedAt)
//     //     })()
//     // });


//     app.get('/api/users', (req, res) => {
//         res.send('Hello World!')
//     });
//     app.get('/messages', (req, res) => {
//         res.send('Hello')
//         console.log('World')
//     });
//     // app.get('/addNewMessages/:tagId', (req, res) => {
//     //     data.push(req.params.tagId);
//     //     res.send(true)
//     //     console.log(data)
//     // });
//     // app.get('/messages/:tagId', function (req, res) {
//     //     res.send("tagId is set to " + req.params.tagId);
//     //     console.log(data[req.params.tagId])
//     // });
//     app.listen(port, () => {
//         console.log(`Example app listening on port ${port}`)
//     });
// })();



//http://localhost:3000/api/users

