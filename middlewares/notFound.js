export const notFound = (req, res) => {
    res.status(404).json({
        ok: false,
        msg: 'Ruta no encontrada'
    });
}