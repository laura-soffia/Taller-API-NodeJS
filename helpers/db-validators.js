import User from '../models/users.models.js';
import Author from '../models/author.model.js';
import Book from '../models/book.model.js';

export const emailExiste = async (email = '') => {

    const existeEmail = await User.findOne({ email });

    if (existeEmail) {
        throw new Error(`El correo ${email} ya está registrado`);
    }
}

// Debe lanzar un Error si falla; si no lanza, pasa
export const existeAutorPorId = async (id) => {
    const autor = await Author.findOne({ _id: id, active: true });
    if (!autor) throw new Error('El autor no existe o está inactivo');
}

// En PUT se excluye el propio libro para que no choque consigo mismo
export const isbnExiste = async (isbn, { req }) => {
    const libro = await Book.findOne({ isbn });
    if (libro && String(libro._id) !== req.params.id) {
        throw new Error('El ISBN ya está registrado');
    }
}