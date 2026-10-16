import express from "express"
import "dotenv/config"
import routerUsers from "./routes/users.routes.js"
import routerAuth from "./routes/auth.routes.js"
import { conex } from "./database/config.js"
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errores.js';


class Server {
    app
    port
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.conetcDB()



        this.middlewares()
        this.routes()
        this.app.use(errorHandler);
    }

    middlewares() {
        this.app.use(express.json())
    }


    routes() {
        this.app.use('/api/auth', routerAuth);
        this.app.use('/api/users', routerUsers);
        this.app.use(notFound);
    }


    async conetcDB() {
        await conex()
    }





    listen() {
        this.app.listen(this.port, () => {
            console.log("Listen port " + this.port)
        })
    }
}

new Server().listen()
