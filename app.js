const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

// create redis client
let client = redis.createClient();

client.on('connect', function(){
    console.log('connected to Redis');
})

const port = 5000;

const app = express();

// view engine - refactor with react or vanilla js
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// override poset method
app.use(methodOverride('_method'));

// search
app.get('/', function(req, res, next){
    res.render('searchusers');
})

// add user
app.get('/user/add', function(req, res, next){
    res.render('adduser')
})

// delete user
app.delete('/user/delete/:id', function(req, res, next){
    client.del(req.params.id);
    res.redirect('/');
})

// process add user
app.post('/user/add', function(req, res, next){
    let id = req.body.id
    let first_name = req.body.first_name
    let last_name = req.body.last_name
    let email = req.body.email
    let phone = req.body.phone

    client.hmset(id, [
        'first_name', first_name,
        'last_name', last_name,
        'email', email,
        'phone', phone
    ], function(err, reply) {
        if (err){
            console.log(err)
        } 
        console.log(reply);
        res.redirect('/');
    })
})

app.post('/user/search', function(req, res, next){
    let id = req.body.id;

    client.hgetall(id, function(err, obj){
        if (!obj){
            res.render('searchusers', {
                error: 'User does not exist'
            });
        } else {
            obj.id = id;
            res.render('details', {
                user: obj
            })
        }
    })

})

app.listen(port, function(){
    console.log('Server started on port ' + port)
})