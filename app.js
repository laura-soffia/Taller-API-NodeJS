import express from "express"
import "dotenv/config"
import routerProduts from "./routes/produts.routes.js"
import routerStores from "./routes/stores.routes.js"
import {conex} from  "./db/config.js"


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
        //     this.app.get("/", (req, res) => {
        //     res.send("Hola Mundo")
        // })

        this.app.use("/api/produts", routerProduts)
        this.app.use("/api/stores", routerStores)


      
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
