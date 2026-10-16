import { Schema, model } from 'mongoose'
import bcrypt from "bcryptjs";

const UserSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres.'],
        maxlength: [60, 'El nombre de usuario debe tener maximo 60 caracteres.']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, ingresa un correo válido'
        ]

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres.'],
    },

    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },

    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,// Añade automáticamente createdAt y updatedAt o se aajusta las fechas 
    versionKey: false  // sirve para llevar un control de verciones util para cuando se traba en grupo 
});



UserSchema.pre('save', async function () {
    try {
        const salt = await bcrypt.genSalt(10); // genera contenido aleatorio para cifrar la pass
        this.password = await bcrypt.hash(this.password, salt); // mezcla la contraseña con la salt 

    } catch (error) {
        throw error;
    }
});


UserSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    }
})

const newUser = model('User', UserSchema);

export default newUser
