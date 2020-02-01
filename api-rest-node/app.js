'use strict'

//REQUIRES
var express = require('express');
var bodyParser = require('body-parser');


//EJECUTAR EXPRESS
var app = express();

//CARGAR ARCHIVO DE RUTAS
var user_routes = require('./routes/user');
var topic_routes= require('./routes/topic');
var comment_routes= require('./routes/comment')

// MIDDLEWARES
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//RUTAS
//REESCRBIR RUTAS
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);



//EXPORTAR MODULO
module.exports = app;