import User from '../models/users.models.js';
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { exit } from 'node:process';

export const register = async (req, res, next) => {

    try {

        const user = await User.create(req.body)

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(201).json({
            ok: true,
            usuario: user.email,
            token
        })

    } catch (error) {
        next(error)
    }
}


export const login = async (req, res, next) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                msg: "Email y contraseña son obligatorios"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ ok: false, msg: "Datos incorrectos" });
        }

        const passwordValida = await bcrypt.compare(password, user.password);

        if (!passwordValida) {
            return res.status(401).json({ ok: false, msg: "Datos incorrectos" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            ok: true,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        next(error);
    }
}

export const getUserMe = async (req, res, next) => {

    try {

        const user = await User.findById(req.params.id)

        const token = req.header('x-token')


        if (!store) {
            return res.status(404).json({
                ok: false,
                msg: "tienda no encontrada"
            })
        }

        res.status(200).json({
            ok: true,
            store

        })

    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {

    try {

        const store = await Store.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (!store) {
            res.status(404).json({
                ok: false,
                msg: "tienda no encontrada"
            })
        }

        res.status(200).json({
            ok: true,
            store

        })

    } catch (error) {
        next(error)
    }
}


export const updateRole = async (req, res, next) => {

    try {

        const store = await Store.findByIdAndDelete(req.params.id)

        if (!store) {
            res.status(404).json({
                ok: false,
                msg: "tienda no encontrada"
            })
        }

        res.status(200).json({
            ok: true,
            msg: "tienda eliminada correctamente"


        })

    } catch (error) {
        next(error)
    }
}

