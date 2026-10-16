import jwt from 'jsonwebtoken';
import User from '../models/users.models.js';
 
export const validarJWT = async (req, res, next) => {
 
    const token = req.header('x-token');
 
    if (!token) {
        return res.status(401).json({ ok: false, msg: 'No hay token en la petición' });
    }
 
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
 
        const user = await User.findById(id);
 
        if (!user || !user.active) {
            return res.status(401).json({ ok: false, msg: 'Token no válido' });
        }
 
        req.user = user;
 
        next();
 
    } catch (error) {
        return res.status(401).json({ ok: false, msg: 'Token no válido' });
    }
}