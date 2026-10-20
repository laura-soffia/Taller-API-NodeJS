export const errorHandler = (err, req, res, next) => {
 
    console.log(err);
 
    if (err.code === 11000) { // ese codigo significa que algun valor esta repetido
        return res.status(400).json({
            ok: false,
            msg: 'Ya existe un registro con ese dato'
        });
    }

    if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) { // body JSON mal formado
        return res.status(400).json({
            ok: false,
            msg: 'La petición no es un JSON válido'
        });
    }

    res.status(500).json({
        ok: false,
        msg: 'Error inesperado, contacte al equipo'
    });
}