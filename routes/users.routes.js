

import { Router } from "express";
import { register, login,getUserMe, getUser } from "../controllers/users.controllers.js";


const router = Router()

router.post("/register", register)

router.post("/login", login)

router.get("/me/:token", getUser)



// router.post("/", [store, name, price, stock, productId, validarCampos], createProduts)

// router.get("/:id", [productId, validarCampos], findById)

// router.put("/:id", [productId, validarCampos], updateProdut)

// router.delete("/:id", [productId, validarCampos], deleteProdut)

// router.patch("/:id", [productId, validarCampos], updateOneProdut)




export default router