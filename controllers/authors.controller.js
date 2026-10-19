import Author from '../models/author.model.js';
import Book from '../models/book.model.js';

export const getAuthors = async (req, res, next) => {
    try {
        const data = await Author.find({ active: true });
        res.status(200).json({ ok: true, data });
    } catch (error) {
        next(error);
    }
}

export const getAuthor = async (req, res, next) => {
    try {
        const author = await Author.findOne({ _id: req.params.id, active: true });

        if (!author) {
            return res.status(404).json({ ok: false, msg: 'Autor no encontrado' });
        }

        const books = await Book.find({ author: author._id, active: true });

        res.status(200).json({ ok: true, data: { ...author.toObject(), books } });
    } catch (error) {
        next(error);
    }
}

export const createAuthor = async (req, res, next) => {
    try {
        const { name, nationality, birthYear } = req.body;
        const data = await Author.create({ name, nationality, birthYear });
        res.status(201).json({ ok: true, data });
    } catch (error) {
        next(error);
    }
}

export const updateAuthor = async (req, res, next) => {
    try {
        const { name, nationality, birthYear } = req.body;

        const data = await Author.findOneAndUpdate(
            { _id: req.params.id, active: true },
            { name, nationality, birthYear },
            { returnDocument: 'after', runValidators: true }
        );

        if (!data) {
            return res.status(404).json({ ok: false, msg: 'Autor no encontrado' });
        }

        res.status(200).json({ ok: true, data });
    } catch (error) {
        next(error);
    }
}

export const deleteAuthor = async (req, res, next) => {
    try {
        const author = await Author.findOne({ _id: req.params.id, active: true });

        if (!author) {
            return res.status(404).json({ ok: false, msg: 'Autor no encontrado' });
        }

        const books = await Book.countDocuments({ author: author._id, active: true });
        if (books > 0) {
            return res.status(409).json({ ok: false, msg: 'El autor tiene libros activos' });
        }

        author.active = false;
        await author.save();

        res.status(200).json({ ok: true, data: author });
    } catch (error) {
        next(error);
    }
}
