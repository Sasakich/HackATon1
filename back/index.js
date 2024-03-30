const http = require('http');
const sqlite3 = require("sqlite3");
const {open} = require("sqlite");
const path = require('path')
const express = require('express')
const app = express();
const port = 3000;
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
    app.get('/api/users/:tagId', (req, res) => {
        (async () => {
            let userId = req.params.tagId
            let a = await db.all('SELECT * FROM users WHERE id = ?', userId)
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



//http://localhost/message:3000