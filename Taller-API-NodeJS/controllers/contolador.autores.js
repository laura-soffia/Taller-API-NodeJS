import Autor from "../models/autores.models.js";
import Libro from "../models/libros.models.js";

export const listAutores = async (req, res, next) => {
  try {
    const data = await Autor.find({ active: true });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

export const listAutor = async (req, res, next) => {
  try {
    const autor = await Autor.findOne({ _id: req.params.id, active: true });
    if (!autor) return res.status(404).json({ ok: false, msg: "Autor no encontrado" });

    const libros = await Libro.find({ author: autor._id, active: true });
    res.json({ ok: true, data: { ...autor.toObject(), libros } });
  } catch (error) {
    next(error);
  }
};

export const createAutor = async (req, res, next) => {
  try {
    const { name, nationality, birthYear } = req.body;
    const data = await Autor.create({ name, nationality, birthYear });
    res.status(201).json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateAutor = async (req, res, next) => {
  try {
    const { name, nationality, birthYear } = req.body;
    const data = await Autor.findOneAndUpdate(
      { _id: req.params.id, active: true },
      { name, nationality, birthYear },
      { returnDocument: "after", runValidators: true }
    );
    if (!data) return res.status(404).json({ ok: false, msg: "Autor no encontrado" });
    res.json({ ok: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteAutor = async (req, res, next) => {
  try {
    const autor = await Autor.findOne({ _id: req.params.id, active: true });
    if (!autor) return res.status(404).json({ ok: false, msg: "Autor no encontrado" });

    const libros = await Libro.countDocuments({ author: autor._id, active: true });
    if (libros > 0) {
      return res.status(409).json({ ok: false, msg: "El autor tiene libros activos" });
    }

    autor.active = false;
    await autor.save();
    res.json({ ok: true, data: autor });
  } catch (error) {
    next(error);
  }
};
