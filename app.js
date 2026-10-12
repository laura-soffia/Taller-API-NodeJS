import express from "express"
import "dotenv/config"
import routerUsers from "./routes/users.routes.js"
import {conex} from  "./database/config.js"


class Server {
    app
    port
    constructor() {
        this.app = express()
        this.port = process.env.PORT
        this.conetcDB()
        


        this.middlewares()
        this.routes()
    }

    middlewares() {
        this.app.use(express.json())
    }


    routes() {
        this.app.use("/api/auth/", routerUsers)


      
    }


    async conetcDB(){
        await conex()
    }





            listen() {
        this.app.listen(this.port, () => {
            console.log("Listen port " + this.port)
        })
    }
}

new Server().listen()
