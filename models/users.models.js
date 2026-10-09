import {Schema, model} from 'mongoose'

// 1. Definir la estructura de los datos (Schema)
const UserSchema = new Schema({

  store:{
    type: Schema.Types.ObjectId,
    ref: "Store",
    require: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  stock: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Añade automáticamente createdAt y updatedAt o se aajusta las fechas 
});


const  newProdut = model('Product', ProdutSchema);

export default newProdut
