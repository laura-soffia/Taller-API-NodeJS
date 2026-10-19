import Book from '../models/book.model.js';

export const getBooks = async (req, res, next) => {
    try {
        const data = await Book.find({ active: true }).populate('author', 'name');
        res.status(200).json({ ok: true, data });
    } catch (error) {
        next(error);
    }
}

export const getAvailableBooks = async (req, res, next) => {
    try {
        const data = await Book.find({
            active: true,
            availableCopies: { $gt: 0 }
        }).populate('author', 'name');

        res.status(200).json({ ok: true, data });
    } catch (error) {
        next(error);
    }
}

export const getBook = async (req, res, next) => {
    try {
        const data = await Book.findOne({ _id: req.params.id, active: true }).populate('author');

        if (!data) {
            return res.status(404).json({ ok: false, msg: 'Libro no encontrado' });
        }

        res.status(200).json({ ok: true, data });
    } catch (error) {
        next(error);
    }
}

export const createBook = async (req, res, next) => {
    try {
        const { title, isbn, author, genre, year, totalCopies } = req.body;

        const data = await Book.create({
            title,
            isbn,
            author,
            genre,
            year,
            totalCopies,
            availableCopies: totalCopies
        });

        res.status(201).json({ ok: true, data });
    } catch (error) {
        next(error);
    }
}

export const updateBook = async (req, res, next) => {
    try {
        const { title, isbn, author, genre, year, totalCopies } = req.body;

        const book = await Book.findOne({ _id: req.params.id, active: true });
        if (!book) {
            return res.status(404).json({ ok: false, msg: 'Libro no encontrado' });
        }

        const update = { title, isbn, author, genre, year };

        if (totalCopies !== undefined) {
            const prestadas = book.totalCopies - book.availableCopies;
            if (totalCopies < prestadas) {
                return res.status(400).json({
                    ok: false,
                    msg: `No puedes bajar de ${prestadas} copias (hay prestadas)`
                });
            }
            update.totalCopies = totalCopies;
            update.availableCopies = totalCopies - prestadas;
        }

        const data = await Book.findByIdAndUpdate(book._id, update, {
            returnDocument: 'after',
            runValidators: true
        });

        res.status(200).json({ ok: true, data });
    } catch (error) {
        next(error);
    }
}

export const deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findOne({ _id: req.params.id, active: true });

        if (!book) {
            return res.status(404).json({ ok: false, msg: 'Libro no encontrado' });
        }

        book.active = false;
        await book.save();

        res.status(200).json({ ok: true, data: book });
    } catch (error) {
        next(error);
    }
}
