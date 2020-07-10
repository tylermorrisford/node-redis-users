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

app.use(methodOverride('_method'));

// search
app.get('/', function(req, res, next){
    res.render('searchusers');
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