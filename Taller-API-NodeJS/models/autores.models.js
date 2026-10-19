import {Schema, model} from "mongoose";

const year = new Date().getFullYear();

const autorSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
            minlength: 3,
            maxlength: 80,
            unique: true,
            trim: true
        },

        nationality:{
            type: String,
            required: true,
            minlength: 3,
            maxlength: 40,
            trim: true
        },

        birthYear: {
            type: Number,
            min: 0,
            max: year,
            required: true,
            trim:true
        },

        active: {
            type: Boolean,
            default: true,
            trim: true
        }
    },
    {
        timestamps: true, versionKey:false
    }
);

// module.exports = model("Autor", autorSchema);
export default model ("Autores", autorSchema);
