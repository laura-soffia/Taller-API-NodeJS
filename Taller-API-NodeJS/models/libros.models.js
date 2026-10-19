import { Schema, model } from "mongoose"

const librosSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 120,
            trim: true
        },

        isbn: {
            type: String,
            required: true,
            unique: true,
            match: /^(\d{10}|\d{13})$/,
            trim: true
        },

        author: {
            type: Schema.Types.ObjectId,
            ref: "Autores",
            required: true
        },

        genre: {
            type: String,
            enum: ["novela", "cuento", "poesia", "ensayo", "tecnologia", "historia", "infantil"],
        },

        year: { type: Number, max: new Date().getFullYear() },
        totalCopies: { type: Number, required: true, min: 1 },
        availableCopies: { type: Number, min: 0, default: 0 },
        active: { type: Boolean, default: true },
    },
{
    timestamps: true, 
    versionKey: false
}
);

// module.exports = model("Libro",librosSchema);

export default model ("Libros", librosSchema);