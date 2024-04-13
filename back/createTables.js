// import sqlite from 'sqlite'
// import { open } from 'sqlite'
const sqlite3 = require("sqlite3");
const {open} = require("sqlite");

(async () => {
  const db = await open({
    filename: './database/database.db',
    driver: sqlite3.cached.Database
  })
  await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    login varchar(255) NOT NULL,
    password varchar(255),
    icon varchar(2083)
    )
  `)
  await db.exec('INSERT INTO users VALUES (null, "test1", "test1", "test1")')
  let a = await db.all('SELECT * FROM users');
  console.log(a);
  await db.exec(`
  CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name varchar(255) NOT NULL,
    icon varchar(2083)
    )
  `)
  await db.exec('INSERT INTO chats VALUES (null, "test2", "test2")')
  a = await db.all('SELECT * FROM chats');
  console.log(a);
  await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chatId int NOT NULL,
    userId int NOT NULL,
    createdAt DATE NOT NULL,
    updatedAt DATE NOT NULL,
    message varchar(2083)                         
    )
  `)
  await db.exec(`INSERT INTO messages VALUES (null, 0, 0, ${Date.now()}, ${Date.now()}, "Hello!")`)
  a = await db.all('SELECT * FROM messages');
  console.log(a);
  await db.exec(`
  CREATE TABLE IF NOT EXISTS chatsToUsers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idChat int NOT NULL,
    idUser int NOT NULL                                      
    )
  `)
  await db.exec('INSERT INTO chatsToUsers VALUES (null, 0, 0)')
  a = await db.all('SELECT * FROM chatsToUsers');
  console.log(a);
})()
