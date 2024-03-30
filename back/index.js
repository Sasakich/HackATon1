const http = require('http');
const sqlite3 = require("sqlite3");
const {open} = require("sqlite");
const path = require('path')

const hostname = '127.0.0.1';
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
(async () => {
    const db = await open({
        filename: path.resolve(__dirname, './database/database.db'),
        driver: sqlite3.Database
    })
    // console.log(db)
    let a = await db.get('SELECT * FROM tbl');
    console.log(a);
})()
