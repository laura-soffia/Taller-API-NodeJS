import Autor from "../models/autores.models.js";
import Libro from "../models/libros.models.js";


// Debe lanzar un Error si falla; si no lanza, pasa
export const existeAutorPorId = async (id) => {
  const autor = await Autor.findOne({ _id: id, active: true });
  if (!autor) throw new Error("El autor no existe o está inactivo");
};

// En PUT se excluye el propio libro para que no choque consigo mismo
export const isbnExiste = async (isbn, { req }) => {
  const libro = await Libro.findOne({ isbn });
  if (libro && String(libro._id) !== req.params.id)
    throw new Error("El ISBN ya está registrado");
};
