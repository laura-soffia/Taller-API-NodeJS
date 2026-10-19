import { Schema, model } from "mongoose";

const LoanSchema = new Schema(
  {
    user: { 
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true 
      },

    book: { 
      type: Schema.Types.ObjectId, 
      ref: "Book", 
      required: true
     },

    loanDate: { 
      type: Date, 
      default: Date.now
     }, 
     // sin () para que se evalue en cada prestamo

    dueDate: { 
      type: Date, 
      required: true 
    },
    // la calcula el controlador (+14 dias)

    returnDate: { 
      type: Date, 
      default: null
     },

    renewals: { type: Number,
       default: 0 
      },

    fine: { type: Number, 
      default: 0
     },
     // multa en pesos por dias de retraso

    status: { 
      type: String, 
      enum: ["ACTIVE", "RETURNED"], 
      default: "ACTIVE" 
    },
  },
  { timestamps: true }
);

export default model("Loan", LoanSchema);