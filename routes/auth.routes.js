import { Router } from 'express';
import { register, login, getUserMe } from '../controllers/users.controllers.js';
import { validarJWT } from '../middlewares/validarJWT.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { name, emailRegisstro, passwordRegistro, email, password} from '../validators/auth.validators.js'
 
const router = Router();
 
router.post('/register',[name, emailRegisstro, passwordRegistro,validarCampos], register);
router.post('/login',[email, password, validarCampos], login);
router.get('/me', [validarJWT], getUserMe);
 
export default router;