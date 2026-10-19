

export const notFound = (req, res) =>
  res.status(404).json({ ok: false, msg: `Ruta ${req.originalUrl} no existe` });

// Express reconoce un errorHandler por sus 4 parámetros
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.code === 11000)
    return res.status(400).json({ ok: false, msg: "Valor duplicado" });
  res.status(500).json({ ok: false, msg: "Error interno del servidor" });
};