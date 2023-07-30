const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const route = require('./routes/routes');
const auth = require('./routes/user');
const cart = require('./routes/cart');
const admin = require('./routes/admin');


const app = express();

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
app.use('/', admin);


http.createServer(app).listen(3000);
console.log('server 3000 is running!\n');