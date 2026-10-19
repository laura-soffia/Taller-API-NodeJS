import { Router } from 'express';
import {
    getAuthors,
    getAuthor,
    createAuthor,
    updateAuthor,
    deleteAuthor,
} from '../controllers/authors.controller.js';
import { validarJWT } from '../middlewares/validarJWT.js';
import { tieneRol } from '../middlewares/tieneRol.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { idCheck, createAuthorValidators, updateAuthorValidators } from '../validators/authors.validators.js';

const router = Router();

router.get('/', getAuthors);
router.get('/:id', [idCheck, validarCampos], getAuthor);

router.post('/', [validarJWT, tieneRol('ADMIN'), ...createAuthorValidators, validarCampos], createAuthor);
router.put('/:id', [validarJWT, tieneRol('ADMIN'), ...updateAuthorValidators, validarCampos], updateAuthor);
router.delete('/:id', [validarJWT, tieneRol('ADMIN'), idCheck, validarCampos], deleteAuthor);

export default router;
