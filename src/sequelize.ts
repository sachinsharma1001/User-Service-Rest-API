import {Sequelize} from 'sequelize-typescript';
import { config } from "./config/config";


const c = config.dev;
console.log("username: " + c.username);
console.log("password:" + c.password);

export const sequelize = new Sequelize({
    "username": c.username,
    "password": c.password,
    "database": c.database,
    "host":     c.host,
  
    dialect: 'postgres',
    storage: ':memory:',
});