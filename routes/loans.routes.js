import { Router } from "express";

import { validarJWT } from "../middlewares/validarJWT.js";
import { tieneRol } from "../middlewares/tieneRol.js";
//Trae dos controles de tus compañeros: validarJWT revisa que haya token y esAdmin revisa que el usuario sea ADMIN.

import { validarCampos } from "../middlewares/validarCampos.js";

import { bookBody, loanId, statusQuery, pagination } from "../validators/loans.validators.js";
//Trae las revisiones de datos: que book sea un id válido, que :id sea válido, que status sea ACTIVE o RETURNED, y que page y limit sean números.

import { createLoan, getMyLoans, getLoans, getOverdueLoans, returnLoan, renewLoan, getTopBooks } from "../controllers/loans.controller.js";

const router = Router();
const esAdmin = tieneRol("ADMIN");

// Rutas fijas /me, /overdue SIEMPRE antes de /:id
router.post("/", [validarJWT, bookBody, validarCampos], createLoan);

router.get("/me", [validarJWT, ...pagination, validarCampos], getMyLoans);//listar prestamos

router.get("/overdue", [validarJWT, esAdmin, ...pagination, validarCampos], getOverdueLoans); //vencidos, solo admin

router.get("/top", [validarJWT, esAdmin], getTopBooks); //top 5, solo admin

router.get("/", [validarJWT, esAdmin, statusQuery, ...pagination, validarCampos], getLoans); //todos, solo admin

router.patch("/:id/renew", [validarJWT, loanId, validarCampos], renewLoan); //renovar

router.patch("/:id/return", [validarJWT, loanId, validarCampos], returnLoan); //devolver

export default router;

