const mongoose = require('mongoose');



const userMessageSchema = new mongoose.Schema({
    username: String,
    message: String
})

const UserMessage = mongoose.model('UserMessage', userMessageSchema);
module.exports = UserMessage;


