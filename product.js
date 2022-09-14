const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    // image: url,
    location: String
})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;


