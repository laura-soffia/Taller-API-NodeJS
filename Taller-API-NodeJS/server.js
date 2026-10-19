const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database/config");
const logger = require("./middlewares/logger");
const { notFound, errorHandler } = require("./middlewares/errores");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.middlewares();
    this.routes();
    this.errors();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json()); // permite leer req.body en JSON
    this.app.use(logger);
  }

  routes() {
    this.app.use("/api/authors", require("./routes/authors"));
    this.app.use("/api/books", require("./routes/books"));
  }

  errors() {
    // Siempre al final: si ninguna ruta respondió, entra notFound
    this.app.use(notFound);
    this.app.use(errorHandler);
  }

  async listen() {
    await dbConnection(); // primero conecta a la BD...
    this.app.listen(this.port, () =>
      console.log(`Servidor en puerto ${this.port}`)
    ); // ...y solo entonces escucha
  }
}

module.exports = Server;