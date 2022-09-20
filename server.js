const express = require('express');
const UserMessage = require("./userMessage");
const UserProfile = require('./userProfile')
const Product = require("./product");
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');


app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));


const dbURI = 'mongodb+srv://@cluster0.pg9lbmp.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }, function () { console.log("connection attempt") })
mongoose.connection.on("error", function (e) { console.log(e) })
mongoose.connection.on("connected", function (e) { console.log("successfully connected to database") })


//set up multer
const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads');
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname);
        },
    }),
    limits: {fileSize: 5424880},
});



app.get('/userProfile', (req, res) => {
    UserProfile.find({}, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            res.json(result);
        }
    })
});

//Show all product lists
app.get('/products', (req, res) => {
    Product.find({}, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            res.json(result);
        }
    }).lean();
});



//Find One product I clicked 
app.get('/products/:id', (req, res) => {
    Product.findById(req.params.id, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(docs);
        }
    }).lean();
});





//find and Delete product
app.delete('/products/:id', (req, res) => {
    Product.findByIdAndRemove({ _id: req.params.id }).then(function (product) {
        res.json(product);
    });
});





//Search engine- find product that users want
app.post('/findproducts', (req, res) => {
    //  find all itmes that match
     Product.find({
         $or: [
         {brand: req.body.brand},{location: req.body.location},{price: req.body.price}]
    }).lean()
    .then(item => {
        if (item){
            return res.json(item);
        }
     })
     .catch((err) => {
        console.log(err)
    }) 
});





//View all messages

app.get('/userMessage', (req, res) => {
    UserMessage.find({}, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            res.json(result);
        }
    })
});




//Send a message
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
})

//list a product
app.post('/products', upload.single('image'), (req, res) => {
    const product = new Product({
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        description: req.body.description,
        image: {
            data: fs.readFileSync(path.join('./uploads/' + req.file.filename)),
            contentType: 'image/png',
        },
        location: req.body.location
    });
    product.save().then(function () {
        fs.unlinkSync(path.join('./uploads/' + req.file.filename));
        res.json(product);
    })
});

//edit a post
app.put('/products/:id', (req, res) => {
    Product.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
        Product.findOne({ _id: req.params.id }).lean().then(function (product) {
            res.send(product);
        })
    });
});





//Register a user with unique details 
app.post('/register', (req, res) => {

    if (req.body.password !== req.body.confirm_password) {
        return res.status(400).json({
            msg: "Password do not match."
        });
    }

    //Check for the unique Username
    UserProfile.findOne({
        username: req.body.username
    }).then(user => {
        if (user) {
            return res.status(400).json({
                msg: "Username is already taken."
            });
        }
    })
    //check for the Unique Email
    UserProfile.findOne({
        email: req.body.email
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
            console.log('register successful')
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



app.listen(3000, () => {
    console.log("listening on port 3000");
});