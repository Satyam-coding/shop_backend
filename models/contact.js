import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    message: {
        type: String
    }
});

export const contact = new mongoose.model("contact", ContactSchema);