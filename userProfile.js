const mongoose = require('mongoose');



const userProfileSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
})

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;

