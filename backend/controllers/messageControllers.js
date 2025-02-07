const asyncHandler = require('express-async-handler');
const User = require('../Models/userModel');
const Message = require('../Models/messageModel');
const Chat = require('../Models/chatModel');

const sendMessage = asyncHandler(async (req, res) => {
    const { chatId, content } = req.body;

    if(!content || !chatId) {
        console.log("Invalid data passed into reqest");
        return res.sendStatus(400);
    }

    var newMessage = ({
        sender: req.user._id,
        content: content,
        chat: chatId
    });

    try {
        var message = await Message.create(newMessage);

        message = await message.populate('sender', "name picture");
        message = await message.populate('chat');
        message = await User.populate(message, { 
            path: 'chat.users',
            select: "name picture email"
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        });

        res.json(message);
    } 
    catch(error) {
        throw new Error(error.message);
    }
});


const allMessages = asyncHandler(async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const messages = await Message.find({ chat: chatId }).populate('sender', 'name picture email').populate("chat");
        res.json(messages);
    } 
    catch(error) {
        throw new Error(error.message);
    }
});



module.exports = { sendMessage, allMessages }