'use strict'
var secret = 'clave';
var jwt= require('jwt-simple');
var moment = require('moment');


exports.authenticated= function(req, res, next){
    //COMPROBAR SI LLEGA AUTORIZACION
    if(!req.headers.authorization){
        return res.status(403).send({
            message: 'La peticion no tiene la cabecera de autorizacion'
        });
    }
    //LIMPIAR EL TOKEN Y QUITAR COMILLAS
    var token= req.headers.authorization.replace(/['"]+/g, '');
    //DECODIFICAR TOKEN
    try{
        var payload = jwt.decode(token, secret);

        //COMPROBAR SI EL TOKEN HA EXPIRADO
        if(payload.exp <= moment().unix()){
            return res.status(404).send({
                message: 'El token ha expirado'
            });
        }

        

    }catch(ex){
        return res.status(404).send({
            message: 'El token no es valido'
        });
    }

    //ADJUNTAR USUARIO IDENTIFICADO A REQUEST
    req.user= payload;
    /*return res.status(200).send({
        payload
    });*/
    //PASAR A ACCION
    next();
};