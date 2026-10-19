import { Router } from 'express';
import {
    getBooks,
    getAvailableBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
} from '../controllers/books.controller.js';
import { validarJWT } from '../middlewares/validarJWT.js';
import { tieneRol } from '../middlewares/tieneRol.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { idCheck, createBookValidators, updateBookValidators } from '../validators/books.validators.js';

const router = Router();

router.get('/', getBooks);
router.get('/available', getAvailableBooks);
router.get('/:id', [idCheck, validarCampos], getBook);

router.post('/', [validarJWT, tieneRol('ADMIN'), ...createBookValidators, validarCampos], createBook);
router.put('/:id', [validarJWT, tieneRol('ADMIN'), ...updateBookValidators, validarCampos], updateBook);
router.delete('/:id', [validarJWT, tieneRol('ADMIN'), idCheck, validarCampos], deleteBook);

export default router;
