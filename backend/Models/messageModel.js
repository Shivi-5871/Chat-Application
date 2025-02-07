const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    content: {type: String, trim: true},

    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    },

    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    // },

    // isRead: {type: Boolean, default: false},
}, {timestamps: true});

const message = mongoose.model('Message', messageSchema);
module.exports = message;