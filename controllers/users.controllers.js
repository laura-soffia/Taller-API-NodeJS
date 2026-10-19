import User from '../models/users.models.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {

    try {
        const { name, email, password } = req.body;

        const user = await User.create({ name, email, password, role: 'USER' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(201).json({
            ok: true,
            data: user,
            token
        });

    } catch (error) {
        next(error);
    }
}


export const login = async (req, res, next) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || !user.active) {
            return res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
        }

        const passwordValida = await bcrypt.compare(password, user.password);

        if (!passwordValida) {
            return res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            ok: true,
            data: user,
            token
        });

    } catch (error) {
        next(error);
    }
}

export const getUserMe = async (req, res, next) => {

    try {

        const user = await User.findById(req.user)

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado"
            })
        }

        res.status(200).json({
            ok: true,
            user

        })

    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req, res, next) => { // falta investigar como hacer este 

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const user = await User.find().skip(skip).limit(limit)
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            ok: true,
            data: user,
            page,
            totalPages: Math.ceil(totalUsers / limit)
        })

    } catch (error) {
        next(error)
    }
}


export const updateRole = async (req, res, next) => {

    try {
        const { role } = req.body;

        if (role !== "ADMIN" && role !== "USER") {
            return res.status(400).json({ ok: false, msg: 'Por favor ingrese un rol valido' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { returnDocument: 'after', runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }

        res.status(200).json({
            ok: true,
            data: user
        });

    } catch (error) {
        next(error);
    }
}

