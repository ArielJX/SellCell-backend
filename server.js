const express = require('express');
// const UserMessage = require("./UserMessages");
// const UserProfile = require('./UserProfile')
const Product = require("./product");
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
const { db } = require('./product');

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const dbURI = '';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }, function () { console.log("connection attempt") })
mongoose.connection.on("error", function (e) { console.log(e) })
mongoose.connection.on("connected", function (e) { console.log("successfully connected to database") })

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

app.get('/products/:id', (req, res) => {
    Product.findById(req.params.id, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(docs);
        }
    });
});

app.post('/userpost', (req, res) => {
    const user = new User;
    user.save();
    res.json(user);
});


app.post('/products', (req, res) => {
    const product = new Product(req.body);
    product.save().then(function () {
        res.json(product);
    })
});

app.put('/products/:id', (req, res) => {
    Product.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
        Product.findOne({ _id: req.params.id }).then(function (product) {
            res.send(product);
        })
    });
});

app.delete('/products/:id', (req, res) => {
    Product.findByIdAndRemove({ _id: req.params.id }).then(function (product) {
        res.send(product);
    });
});


app.listen(3000, () => {
    console.log("listening on port 3000");
});