var http = require('http');
var express = require('express');
var authorizeModule = require('./authorize');
var authorize = authorizeModule.authorize;
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var route = require('./routes/routes');
var auth = require('./routes/user');
var cart = require("./routes/cart.js");
var Product = require("./models/product");


var app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1/WEPPO', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', error => {
    console.log(error);
})
db.once('open', () => {
    console.log('Connected to Mongoose');
})

// to reset database:
//db.dropCollection();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'));

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./public'));
app.use(express.json());

app.use('/', route);
app.use('/cart', cart);
app.use('/', auth);


// after logout delete user cookie and redirect to home page
app.get( '/logout', (req, res) => {
    res.cookie('user', '', { maxAge: -1 } );
    res.redirect('/');
});

// login page
app.get( '/login', (req, res) => {
    res.render('login');
});

// search page
app.get( '/search', authorize(), (req, res) => {
    res.render('search', {user: req.user});
});

// search bar
app.post('/getProducts', async (req, res) => {
    let payload = req.body.payload;
    let search = await Product.find({productName: {$regex: new RegExp('^'+payload+'.*', 'i')}}).exec();
    res.send({payload: search});
})

http.createServer(app).listen(3000);
console.log( 'server 3000 is running!\n');
 