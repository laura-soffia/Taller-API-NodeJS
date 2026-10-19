import Libro from "../models/libros.models.js";

export const getLibros = async (req, res, next) => {
  try {
    const data = await Libro.find({ active: true }).populate("author", "name");
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

export const getAvailable = async (req, res, next) => {
  try {
    const data = await Libro.find({
      active: true,
      availableCopies: { $gt: 0 },
    }).populate("author", "name");
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

export const getLibro = async (req, res, next) => {
  try {
    const data = await Libro.findOne({ _id: req.params.id, active: true }).populate("author");
    if (!data) return res.status(404).json({ ok: false, msg: "Libro no encontrado" });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

export const createLibro = async (req, res, next) => {
  try {
    const { title, isbn, author, genre, year, totalCopies } = req.body;
    const data = await Libro.create({
      title,
      isbn,
      author,
      genre,
      year,
      totalCopies,
      availableCopies: totalCopies,
    });
    res.status(201).json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateLibro = async (req, res, next) => {
  try {
    const { title, isbn, author, genre, year, totalCopies } = req.body;
    const libro = await Libro.findOne({ _id: req.params.id, active: true });
    if (!libro) return res.status(404).json({ ok: false, msg: "Libro no encontrado" });

    const update = { title, isbn, author, genre, year };
    if (totalCopies !== undefined) {
      const prestadas = libro.totalCopies - libro.availableCopies;
      if (totalCopies < prestadas) {
        return res.status(400).json({
          ok: false,
          msg: `No puedes bajar de ${prestadas} copias (hay prestadas)`,
        });
      }
      update.totalCopies = totalCopies;
      update.availableCopies = totalCopies - prestadas;
    }

    const data = await Libro.findByIdAndUpdate(libro._id, update, {
      returnDocument: "after",
      runValidators: true,
    });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteLibro = async (req, res, next) => {
  try {
    const libro = await Libro.findOne({ _id: req.params.id, active: true });
    if (!libro) return res.status(404).json({ ok: false, msg: "Libro no encontrado" });

    libro.active = false;
    await libro.save();
    res.json({ ok: true, data: libro });
  } catch (error) {
    next(error);
  }
};
