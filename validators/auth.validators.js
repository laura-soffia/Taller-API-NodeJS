import { check } from 'express-validator';
import { emailExiste } from '../helpers/db-validators.js';

// validaciones de registros
const name = check('name', 'El nombre es obligatorio').notEmpty()
const emailRegisstro = check('email', 'El correo no es válido').isEmail().custom(emailExiste)
const passwordRegistro = check('password', 'La contraseña debe tener mínimo 6 caracteres').isLength({ min: 6 })


// validaciones de login
const email = check('email', 'El correo no es válido').isEmail()
const password = check('password', 'La contraseña es obligatoria').notEmpty()



export {
    name,
    emailRegisstro,
    passwordRegistro,
    email,
    password
}