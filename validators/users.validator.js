import { check } from 'express-validator';

const id = check('id', 'No es un id válido').isMongoId()
const role = check('role', 'El rol debe ser USER o ADMIN').isIn(['USER', 'ADMIN'])



export {
    id,
    role
}