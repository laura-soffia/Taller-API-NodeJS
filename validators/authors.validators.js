import { check } from 'express-validator';

const year = new Date().getFullYear();

export const idCheck = check('id', 'ID inválido').isMongoId();

export const createAuthorValidators = [
    check('name', 'Nombre de 3 a 80 caracteres').trim().isLength({ min: 3, max: 80 }),
    check('nationality', 'Nacionalidad de 3 a 40 caracteres').trim().isLength({ min: 3, max: 40 }),
    check('birthYear', `Año entre 0 y ${year}`).isInt({ min: 0, max: year }),
];

export const updateAuthorValidators = [
    idCheck,
    check('name', 'Nombre de 3 a 80 caracteres').optional().trim().isLength({ min: 3, max: 80 }),
    check('nationality', 'Nacionalidad de 3 a 40 caracteres').optional().trim().isLength({ min: 3, max: 40 }),
    check('birthYear', `Año entre 0 y ${year}`).optional().isInt({ min: 0, max: year }),
];
