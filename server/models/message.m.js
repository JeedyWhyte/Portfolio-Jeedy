const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [100, "Name must be 100 characters or fewer"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            maxlength: [254, "Email address is too long"],
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            maxlength: [2000, "Message must be 2000 characters or fewer"],
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;