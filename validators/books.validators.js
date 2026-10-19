import { check } from 'express-validator';
import { existeAutorPorId, isbnExiste } from '../helpers/db-validators.js';

const year = new Date().getFullYear();
const GENEROS = ['novela', 'cuento', 'poesia', 'ensayo', 'tecnologia', 'historia', 'infantil'];

export const idCheck = check('id', 'ID inválido').isMongoId();

export const createBookValidators = [
    check('title', 'Título de 1 a 120 caracteres').trim().isLength({ min: 1, max: 120 }),
    check('isbn', 'ISBN: 10 o 13 dígitos').matches(/^(\d{10}|\d{13})$/).bail().custom(isbnExiste),
    check('author', 'Autor inválido').isMongoId().bail().custom(existeAutorPorId),
    check('genre', `Género: ${GENEROS.join(', ')}`).optional().isIn(GENEROS),
    check('year', `Año entero no mayor a ${year}`).optional().isInt({ min: 0, max: year }),
    check('totalCopies', 'totalCopies entero >= 1').isInt({ min: 1 }),
];

export const updateBookValidators = [
    idCheck,
    check('title', 'Título de 1 a 120 caracteres').optional().trim().isLength({ min: 1, max: 120 }),
    check('isbn', 'ISBN: 10 o 13 dígitos').optional().matches(/^(\d{10}|\d{13})$/).bail().custom(isbnExiste),
    check('author', 'Autor inválido').optional().isMongoId().bail().custom(existeAutorPorId),
    check('genre', `Género: ${GENEROS.join(', ')}`).optional().isIn(GENEROS),
    check('year', `Año entero no mayor a ${year}`).optional().isInt({ min: 0, max: year }),
    check('totalCopies', 'totalCopies entero >= 1').optional().isInt({ min: 1 }),
];
