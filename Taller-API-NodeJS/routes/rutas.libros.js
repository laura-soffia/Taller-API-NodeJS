import { Router } from "express";
import { check } from "express-validator";
import {
  createLibro,
  deleteLibro,
  getAvailable,
  getLibro,
  getLibros,
  updateLibro,
} from "../controllers/controlador.libros.js";
import { existeAutorPorId, isbnExiste } from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();
const year = new Date().getFullYear();
const generos = ["novela", "cuento", "poesia", "ensayo", "tecnologia", "historia", "infantil"];
const idCheck = check("id", "ID inválido").isMongoId();

router.get("/", getLibros);
router.get("/available", getAvailable);
router.get("/:id", [idCheck, validarCampos], getLibro);

router.post("/", [
  check("title", "Título de 1 a 120 caracteres").trim().isLength({ min: 1, max: 120 }),
  check("isbn", "ISBN: 10 o 13 dígitos").matches(/^(\d{10}|\d{13})$/).bail().custom(isbnExiste),
  check("author", "Autor inválido").isMongoId().bail().custom(existeAutorPorId),
  check("genre", `Género: ${generos.join(", ")}`).optional().isIn(generos),
  check("year", `Año entero no mayor a ${year}`).optional().isInt({ min: 0, max: year }),
  check("totalCopies", "totalCopies entero ≥ 1").isInt({ min: 1 }),
  validarCampos,
], createLibro);

router.put("/:id", [
  idCheck,
  check("title", "Título de 1 a 120 caracteres").optional().trim().isLength({ min: 1, max: 120 }),
  check("isbn", "ISBN: 10 o 13 dígitos").optional().matches(/^(\d{10}|\d{13})$/).bail().custom(isbnExiste),
  check("author", "Autor inválido").optional().isMongoId().bail().custom(existeAutorPorId),
  check("genre", `Género: ${generos.join(", ")}`).optional().isIn(generos),
  check("year", `Año entero no mayor a ${year}`).optional().isInt({ min: 0, max: year }),
  check("totalCopies", "totalCopies entero ≥ 1").optional().isInt({ min: 1 }),
  validarCampos,
], updateLibro);

router.delete("/:id", [idCheck, validarCampos], deleteLibro);

export default router;
