import { Schema, model } from "mongoose"

const year = new Date().getFullYear()

const AuthorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 80
    },

    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 40
    },

    birthYear: {
      type: Number,
      required: true,
      min: 0,
      max: year
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

export default model("Author", AuthorSchema)
