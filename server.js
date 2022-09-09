const express = require('express');
const User = require("./User");
const Product = require("./Product");
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true}));

const dbURI = 'mongodb+srv://graceyoobee:crystal123@nodetuts.elfpghz.mongodb.net/node-tuts?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }, function (){console.log("connection attempt")})
mongoose.connection.on("error", function (e) {console.log(e)})
mongoose.connection.on("connected", function (e) {console.log("successfully connected to database")})

app.get('/user', (req, res) => {
    User.find({}, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            res.json(result);
        }
    }) 
    });

app.get('/products', (req, res) => {
    Product.find({}, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            res.json(result);
        }
    }) 
    });


app.post('/userpost', (req, res) => {
    const user = new User;
    user.save();
    res.json(user);
})


app.post('/products', (req, res) => {
    const product = new Product(req.body);

    product.save()
    .then((result) => {
        res.redirect('/products'); 
    })
    .catch((err) => {
        console.log(err)
    }) 
    res.json(product);
    console.log(req.body);
})


app.listen(3000, () => {
    console.log("listening on port 3000");
});