import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
    },
    available: {
        type: Boolean,
        default: false,
    },
    user: { // Relación con el usuario
        type: Schema.Types.ObjectId, // Será un ID creado por mongo
        ref: "User",
        required: true
    }
});

export const CategoryModel = mongoose.model("Category", categorySchema);
