import { sequelize } from "./sequelize"
import express from 'express';
import bodyParser from "body-parser";
import { UserRouter } from "./controllers/users/routes/user.router";
import { User } from "./controllers/users/models/User";
require('dotenv').config();

(async() => {
    await sequelize.addModels([User]);
    await sequelize.sync();

    const app = express();
    const port = process.env.PORT || 8080; // default port to listen
  
    app.use(bodyParser.json());

    //CORS Should be restricted
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:8100");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        next();
  });

    app.use('/api/v0/', UserRouter)

    app.get( "/", async ( req, res ) => {
        res.send( "/api/v0/" );
    });
  
    app.listen( port, () => {
        console.log( `server running http://localhost:${ port }` );
        console.log( `press CTRL+C to stop server` );
    });
})();