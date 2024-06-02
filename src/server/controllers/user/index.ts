import {Router, Request, Response} from 'express';
import sqlite3 from "sqlite3";
import { open } from 'sqlite';

export const userRoute: Router = Router();

const names = [
    'Сэр Корвалол',
    'Рыцарь-о-пончик',
    'Лунный танцор',
    'Солнечный зайчик',
    'Капитан Подсолнух',
    'Гусеница-путешественница',
    'Шоколадный магнат',
];


    userRoute.get('/api/me',  (_req: Request, res: Response) => {
      const name = names[new Date().getDay()];

      // const user = await db.get(
      //     'SELECT * FROM users WHERE login = ? AND password = ?',
      //     ['test1', 'test1']
      // );
      res.json({name});
    });

