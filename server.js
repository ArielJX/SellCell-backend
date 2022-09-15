const express = require('express');
const UserMessage = require("./userMessage");
const UserProfile = require('./userProfile')
const Product = require("./product");
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
const { db } = require('./product');
const bcrypt = require('bcryptjs');


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const dbURI = 'mongodb+srv://admin:yoobee123456@cluster0.emeo5tx.mongodb.net/CellSell?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }, function () { console.log("connection attempt") })
mongoose.connection.on("error", function (e) { console.log(e) })
mongoose.connection.on("connected", function (e) { console.log("successfully connected to database") })


app.get('/userProfile', (req, res) => {
    UserProfile.find({}, function (error, result) {
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
});
app.get('/userMessage', (req, res) => {
    UserMessage.find({}, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            res.json(result);
        }
    })
});

app.post('/userMessage', (req, res) => {
    const message = new UserMessage(req.body);

    message.save()
        .then((result) => {
            res.redirect('/userMessage');
        })
        .catch((err) => {
            console.log(err)
        })
    res.json(message);
    console.log(req.body);
})


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


app.get('/products', (req, res) => {
    Product.find({}, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            res.json(result);
        }
    })
});


app.get('/register', (req, res) => {
    UserProfile.find({}, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            res.json(result);
        }
    })
});


app.post('/register', (req, res) => {
    let {
        username,
        email,
        password,
        confirm_password
    } = req.body
    if (password !== confirm_password) {
        return res.status(400).json({
            msg: "Password do not match."
        });
    }

    //Check for the unique Username
    UserProfile.findOne({
        username: username
    }).then(user => {
        if (user) {
            return res.status(400).json({
                msg: "Username is already taken."
            });
        }
    })

    //check for the Unique Email
    UserProfile.findOne({
        email: email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                msg: "Email is already registered. Did you forget your password?"
            });
        }
    });
    // The data is valid and now we can register the user
    let newUser = new UserProfile(req.body);

    newUser.save()
        .then((result) => {
            res.redirect('/login');
        })
        .catch((err) => {
            console.log(err)
        })
    res.json(newUser);
    console.log(req.body);


    //Hash the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                return res.status(201).json({
                    success: true,
                    msg: "User is now registered"
                });
            });
        });
    });
});

app.delete("profile/:id", (req, res) => {
    console.log(req.params.id);

})

app.listen(3000, () => {
    console.log("listening on port 3000");
});