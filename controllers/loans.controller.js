import Loan from "../models/loan.model.js"
import Book from "../models/book.model.js" // ajustar nombre

const DIAS_PRESTAMO = 14
const MAX_ACTIVOS = 3
const MULTA_POR_DIA = 1000 // multa por dia de retraso
const MAX_RENOVACIONES = 1 // renovaciones permitidas

// POST /api/loans  (R1, R2, R3, R4)
export const createLoan = async (req, res, next) => {
    try {
        const bookId = req.body.book
        const userId = req.user._id // sale del token, no del body

        const existe = await Book.exists({ _id: bookId })
        if (!existe) {
            res.status(404).json({
                ok: false,
                msg: "Libro no encontrado"
            })
            return
        }

        // R3 no puede tener el mismo libro activo dos veces
        const repetido = await Loan.exists({ user: userId, book: bookId, status: "ACTIVE" })
        if (repetido) {
            res.status(409).json({
                ok: false,
                msg: "Ya tienes este libro prestado"
            })
            return
        }

        // R2: maximo 3 prestamos activos
        const activos = await Loan.countDocuments({ user: userId, status: "ACTIVE" })
        if (activos >= MAX_ACTIVOS) {
            res.status(409).json({
                ok: false,
                msg: "Límite de préstamos alcanzado"
            })
            return
        }

        // R1 y R4 valida y resta una copia en una sola operacion
        const book = await Book.findOneAndUpdate(
            { _id: bookId, active: true, availableCopies: { $gt: 0 } },
            { $inc: { availableCopies: -1 } },
            { returnDocument: "after" }
        )
        if (!book) {
            res.status(409).json({
                ok: false,
                msg: "No hay copias disponibles"
            })
            return
        }

        let loan
        try {
            loan = await Loan.create({
                user: userId,
                book: bookId,
                dueDate: new Date(Date.now() + DIAS_PRESTAMO * 24 * 60 * 60 * 1000)
            })
        } catch (error) {
            // si falla crear el prestamo devolvemos la copia
            await Book.updateOne({ _id: bookId }, { $inc: { availableCopies: 1 } })
            throw error
        }

        res.status(201).json({
            ok: true,
            data: loan
        })
    } catch (error) {
        next(error)
    }
}

// GET /api/loans/me
export const getMyLoans = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const filtro = { user: req.user._id }

        const total = await Loan.countDocuments(filtro)
        const loans = await Loan.find(filtro)
            .populate("book", "title author isbn")
            .sort({ loanDate: -1 })
            .skip((page - 1) * limit)
            .limit(limit)

        res.status(200).json({
            ok: true,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: loans
        })
    } catch (error) {
        next(error)
    }
}

// GET /api/loans ADMIN filtro opcional status
export const getLoans = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const filtro = {}
        if (req.query.status) {
            filtro.status = req.query.status
        }

        const total = await Loan.countDocuments(filtro)
        const loans = await Loan.find(filtro)
            .populate("book", "title author isbn")
            .populate("user", "name email")
            .sort({ loanDate: -1 })
            .skip((page - 1) * limit)
            .limit(limit)

        res.status(200).json({
            ok: true,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: loans
        })
    } catch (error) {
        next(error)
    }
}

// GET /api/loans/overdue ADMIN
export const getOverdueLoans = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const filtro = { status: "ACTIVE", dueDate: { $lt: new Date() } }

        const total = await Loan.countDocuments(filtro)
        const loans = await Loan.find(filtro)
            .populate("book", "title author isbn")
            .populate("user", "name email")
            .sort({ dueDate: 1 })
            .skip((page - 1) * limit)
            .limit(limit)

        res.status(200).json({
            ok: true,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: loans
        })
    } catch (error) {
        next(error)
    }
}

// PATCH /api/loans/:id/return R4, R6, R7
export const returnLoan = async (req, res, next) => {
    try {
        const loan = await Loan.findById(req.params.id)

        if (!loan) {
            res.status(404).json({
                ok: false,
                msg: "Préstamo no encontrado"
            })
            return
        }

        // R7 solo el dueño del prestamo o un ADMIN
        const esDueno = loan.user.toString() === req.user._id.toString()
        if (!esDueno && req.user.role !== "ADMIN") {
            res.status(403).json({
                ok: false,
                msg: "No tienes permiso"
            })
            return
        }

        // R6 solo se actualiza si esta activo
        const ahora = new Date()
        const diasRetraso = Math.max(0, Math.ceil((ahora - loan.dueDate) / (24 * 60 * 60 * 1000)))
        const devuelto = await Loan.findOneAndUpdate(
            { _id: loan._id, status: "ACTIVE" },
            { status: "RETURNED", returnDate: ahora, fine: diasRetraso * MULTA_POR_DIA },
            { returnDocument: "after" }
        )
        if (!devuelto) {
            res.status(400).json({
                ok: false,
                msg: "El préstamo ya fue devuelto"
            })
            return
        }

        // R4 al devolver, sube una copia
        await Book.updateOne({ _id: loan.book }, { $inc: { availableCopies: 1 } })

        res.status(200).json({
            ok: true,
            data: devuelto
        })
    } catch (error) {
        next(error)
    }
}

// PATCH /api/loans/:id/renew
// renovar, suma 14 dias
export const renewLoan = async (req, res, next) => {
    try {
        const loan = await Loan.findById(req.params.id)

        if (!loan) {
            res.status(404).json({
                ok: false,
                msg: "Préstamo no encontrado"
            })
            return
        }

        const esDueno = loan.user.toString() === req.user._id.toString()
        if (!esDueno && req.user.role !== "ADMIN") {
            res.status(403).json({
                ok: false,
                msg: "No tienes permiso"
            })
            return
        }

        // solo si esta activo y no supera el maximo de renovaciones
        const renovado = await Loan.findOneAndUpdate(
            { _id: loan._id, status: "ACTIVE", renewals: { $lt: MAX_RENOVACIONES } },
            {
                $set: { dueDate: new Date(loan.dueDate.getTime() + DIAS_PRESTAMO * 24 * 60 * 60 * 1000) },
                $inc: { renewals: 1 }
            },
            { returnDocument: "after" }
        )
        if (!renovado) {
            res.status(400).json({
                ok: false,
                msg: "El préstamo no se puede renovar"
            })
            return
        }

        res.status(200).json({
            ok: true,
            data: renovado
        })
    } catch (error) {
        next(error)
    }
}

// GET /api/loans/top  
// ADMIN: top 5 libros mas prestados
export const getTopBooks = async (req, res, next) => {
    try {
        // agrupar por libro, ordenar de mayor a menor y dejar los 5 primeros
        const grupos = await Loan.aggregate([
            { $group: { _id: "$book", totalPrestamos: { $sum: 1 } } },
            { $sort: { totalPrestamos: -1 } },
            { $limit: 5 }
        ])
        // reemplazar el id por los datos del libro
        const top = await Book.populate(grupos, { path: "_id", select: "title author" })

        res.status(200).json({
            ok: true,
            data: top
        })
    } catch (error) {
        next(error)
    }
}
