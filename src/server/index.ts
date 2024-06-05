import express, {Request, Response} from 'express';
import sqlite3 from 'sqlite3';
import {open} from 'sqlite';
import {withApiRoutes} from './controllers';
import {Server} from 'socket.io';
import http from 'http';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
// import {userRoute} from "./controllers/user";
// require('./generateIcon.js');
// const getIcon: any = require('./generateIcon.js').getIcon;

const CLIENT_ID = "2897c730c31dd10adb98";
const CLIENT_SECRET = "5e58f80274b20bc1fe8cf264011d230290c4c72e";
const BASE = process.env.BASE || '/';
const PORT = +(process.env.PORT || 0) || 3000;

const isProduction = process.env.NODE_ENV === 'production';

const createApp = async () => {
    const templateHtml = isProduction
        ? await readFile(join(__dirname, 'client', 'index.html'), 'utf-8')
        : '';

    const app = express();
    let viteServer: any;

    if (isProduction) {
        const sirv = (await import('sirv')).default;
        app.use(BASE, sirv(join(__dirname, 'client'), {extensions: []}));
    } else {
        const vite = await import('vite');
        viteServer = await vite.createServer({
            server: {middlewareMode: true},
            appType: 'custom',
        });
        app.use(viteServer.middlewares);
    }

    const db = await open({
        filename: join(__dirname, 'database', 'database.db'),
        driver: sqlite3.Database
    });
    withApiRoutes(app);
    app.use('/api/me',  async (_req: Request, res: Response) => {
        // const name = names[new Date().getDay()];
        const { login, password } = _req.query;
        console.log("adasdasdasd")
        await db.all(
            'INSERT INTO users (id, login, password, icon) VALUES (?,?,?,?)',
            // [null, login, password, "test2"] todo нужно передавать
            [null, "test2", "test2", "test2"]
        )
        // res.json({user});
    });
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
            // headers: {
            //     "Authorization": req.get("Authorization")
            // }
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

    // Route to get all messages from one chat
    app.get('/getChatMessages', async (req, res) => {
        const { chatId } = req.query;
        try {
            const messages = await db.all(
                'SELECT * FROM messages WHERE chatId = ?',
                chatId
            );
            res.json(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).send('Error fetching messages');
        }
    });

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
    //   headers: {
    //     "Authorization": req.get("Authorization")
    //   }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      res.json(data);
    })
  })
  function intersection(arr: any) {
    let arr1: any = arr[0];
    let arr2: any = arr[1];
    const set2 = new Set(arr2);
    return arr1.filter((value: any) => set2.has(value));
  }

  // Route to create a new chat
  app.post('/createChat', async (req, res) => {
    const {name, userIds} = req.body;
    try {
        var arr: any[] = [];
        for (const userId of userIds) {
            const chats = await db.all(
                `SELECT * FROM usersToChats WHERE idUser = ?`,
                userId
            );
            var tmp = [];
            for (const chat of chats) {
                tmp.push(chat.idChat);
            }
            arr.push(tmp);
        }
        // console.log(intersection(...arr))
        if (intersection(arr).length != 0) {
            res.status(201).send('Chat already exists');
        } else {
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
        }
    } catch (error) {
            console.error('Error creating chat:', error);
            res.status(500).send('Error creating chat');
    }});

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

     

     // Route to get all chats
     app.get('/getChat/:chatId', async (req, res) => {
        const { chatId } = req.query;
        try {
            const chats = await db.all('SELECT FROM chats WHERE chatId = ?',
                chatId
            );
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

    // app.post('./createUser', async (username, password) => { //todo Implement hashing of the password
    //     const hashedPassword = bcrypt.hashSync(password, 10); // 10 is the saltRounds
    //     db.run('INSERT INTO users (login, password, icon) VALUES (?, ?, ?)', [username, hashedPassword, getIcon], function(err) {
    //         if (err) {
    //             console.error('Error creating user:', err.message);
    //         } else {
    //             console.log('User created successfully');
    //         }
    //     });
    // });

    // app.get('./verifyPassword', async (username, password, callback) =>{
    //     db.get('SELECT hashed_password FROM users WHERE username = ?', [username], function(err, row) {
    //         if (err) {
    //             callback(err);
    //         } else if (!row) {
    //             callback(false); // User not found
    //         } else {
    //             const hashedPassword = row.hashed_password;
    //             callback(bcrypt.compareSync(password, hashedPassword));
    //         }
    //     });
    // });
    app.use('*', async (req, res) => {
        const url = req.originalUrl.replace(BASE, '');
        let html = templateHtml;

        if (!isProduction) {
            html = await readFile('index.html', 'utf-8');
            html = await viteServer.transformIndexHtml(url, html);
        }

        res.status(200).set({'Content-Type': 'text/html'}).send(html);
    });


    const httpServer = http.createServer(app);
    const io = new Server(httpServer);

    // Socket.io connection
    io.on('connection', socket => {
        console.log('User connected');

        socket.on('chat message', async msg => {
            const {chatId, userId, text, name, image} = msg;
            try {
                // const db = await open({
                //     filename: join(__dirname, 'database', 'database.db'),
                //     driver: sqlite3.Database
                // });
                const createdAt = new Date().toISOString();
                const updatedAt = createdAt;
                await db.run(
                    'INSERT INTO messages (chatId, userId, createdAt, updatedAt, message) VALUES (?, ?, ?, ?, ?)',
                    [chatId, userId, createdAt, updatedAt, text]
                );

                const message = await db.get(
                    'SELECT * FROM messages WHERE chatId = ? AND userId = ? AND createdAt = ? AND updatedAt = ? AND message = ?',
                    [chatId, userId, createdAt, updatedAt, text]
                );
                if (name != "") {
                    await db.run(
                        'INSERT INTO message_images (messageId, imageId) VALUES (?, ?)',
                        [message.messageId, image]
                    );
                    await db.run(
                        'INSERT INTO images (imageName, imageData) VALUES (?, ?)',
                        [name, image]
                    );
                }
                io.emit('chat message', message);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    httpServer.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
    // }).catch(error => {
    //     console.error('Error connecting to database:', error);
    // });
};


createApp().catch((err) => console.log(err));
