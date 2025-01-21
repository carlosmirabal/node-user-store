import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
    },
    available: {
        type: Boolean,
        default: false,
    },
    price: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
    },
    user: { // Relación con el usuario
        type: Schema.Types.ObjectId, // Será un ID creado por mongo
        ref: "User",
        required: true
    },
    category: { // Relacción con la colección de categorias
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
});

export const ProductModel = mongoose.model("Product", productSchema);
