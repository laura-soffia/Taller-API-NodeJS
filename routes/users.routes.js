import { Router } from 'express';
import { getUsers, updateRole } from '../controllers/users.controllers.js';
import { validarJWT } from '../middlewares/validarJWT.js';
import { tieneRol } from '../middlewares/tieneRol.js';
import {  id, role } from "../validators/users.validator.js";
 
const router = Router();
 
router.get('/', [ validarJWT, tieneRol('ADMIN')], getUsers);
router.patch('/:id/role', [id, role, validarJWT, tieneRol('ADMIN')], updateRole);
 
export default router;