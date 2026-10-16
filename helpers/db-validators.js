import User from '../models/users.models.js';
 
export const emailExiste = async (email = '') => {
 
    const existeEmail = await User.findOne({ email });
 
    if (existeEmail) {
        throw new Error(`El correo ${email} ya está registrado`);
    }
}