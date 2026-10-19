import { Schema, model } from "mongoose"

const year = new Date().getFullYear()
const GENEROS = ["novela", "cuento", "poesia", "ensayo", "tecnologia", "historia", "infantil"]

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 120
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
      ref: "Author",
      required: true
    },

    genre: {
      type: String,
      enum: GENEROS
    },

    year: {
      type: Number,
      max: year
    },

    totalCopies: {
      type: Number,
      required: true,
      min: 1
    },

    availableCopies: {
      type: Number,
      min: 0,
      default: function () {
        return this.totalCopies
      }
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export default model("Book", BookSchema)
