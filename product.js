const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({
    name: String,
    brand: String,
    price: Number,
    description: String,
    location: String
})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;


