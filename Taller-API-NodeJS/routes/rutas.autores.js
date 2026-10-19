import { Router } from "express";
import { check } from "express-validator";
import {
  createAutor,
  deleteAutor,
  listAutor,
  listAutores,
  updateAutor,
} from "../controllers/contolador.autores.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();
const year = new Date().getFullYear();
const idCheck = check("id", "ID inválido").isMongoId();

router.get("/", listAutores);
router.get("/:id", [idCheck, validarCampos], listAutor);

router.post("/", [
  check("name", "Nombre de 3 a 80 caracteres").trim().isLength({ min: 3, max: 80 }),
  check("nationality", "Nacionalidad de 3 a 40 caracteres").trim().isLength({ min: 3, max: 40 }),
  check("birthYear", `Año entre 0 y ${year}`).isInt({ min: 0, max: year }),
  validarCampos,
], createAutor);

router.put("/:id", [
  idCheck,
  check("name", "Nombre de 3 a 80 caracteres").optional().trim().isLength({ min: 3, max: 80 }),
  check("nationality", "Nacionalidad de 3 a 40 caracteres").optional().trim().isLength({ min: 3, max: 40 }),
  check("birthYear", `Año entre 0 y ${year}`).optional().isInt({ min: 0, max: year }),
  validarCampos,
], updateAutor);

router.delete("/:id", [idCheck, validarCampos], deleteAutor);

export default router;
