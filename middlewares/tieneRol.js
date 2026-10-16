export const tieneRol = (...rolesPermitidos) => {
 
    return (req, res, next) => {
 
        if (!req.user) {
            return res.status(500).json({
                ok: false,
                msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }
 
        if (!rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({
                ok: false,
                msg: `El servicio requiere uno de estos roles: ${rolesPermitidos.join(', ')}`
            });
        }
 
        next();
    }
}