import express from "express"
import "dotenv/config"
import routerAutores from "./routes/rutas.autores.js"
import routerLibros from "./routes/rutas.libros.js"
import { dbConnection } from "./database/config.js"
import logger from "./middlewares/logger.js"
import { errorHandler, notFound } from "./middlewares/errores.js"


class Server {
    app
    port
    constructor() {
        this.app = express()
        this.port = process.env.PORT || 3000
        this.middlewares()
        this.routes()
        this.errors()
    }

    middlewares() {
        this.app.use(express.json())
        this.app.use(logger)
    }


    routes() {
        this.app.use("/api/autores", routerAutores)
        this.app.use("/api/libros", routerLibros)
    }

    errors() {
        this.app.use(notFound)
        this.app.use(errorHandler)
    }

    async listen() {
        await dbConnection()
        this.app.listen(this.port, () => {
            console.log("Listen port " + this.port)
        })
    }
}

new Server().listen().catch((error) => {
    console.error("No se pudo iniciar la API:", error)
    process.exitCode = 1
})
