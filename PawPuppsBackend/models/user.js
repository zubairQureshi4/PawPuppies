const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { TOKEN_KEY } = process.env

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    userType: String,
    password: String,
    profilePic: String,
    token: String,
    wishlist: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" }, quantity: Number }]

});

module.exports = mongoose.model('user', userSchema)