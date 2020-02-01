'use strict'
var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var fs = require('fs');
var path = require('path');
var jwt = require('../services/jwt')
var controller = {
    save: function (req, res) {
        //RECOGER LOS PARAMETROS DE LA PETICION
        var params = req.body;

        //VALIDAR LOS DATOS
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }
        if (validate_name && validate_surname && validate_password && validate_email) {
            //CREAR OBJETO DE USUARIO
            var user = new User();

            //ASIGNAR VALORES AL OBJETO
            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email.toLowerCase();
            user.password = params.password;
            user.role = 'ROLE_USER';
            user.image = null;
            //COMPROBAR SI EL USUARIO EXISTE
            User.findOne({ email: user.email }, (err, isSetUser) => {
                if (err) {
                    return res.status(500).send({
                        message: 'Error al comproblar duplicidad de usuario'

                    });
                }

                if (!isSetUser) {
                    //SI NO EXISTE,

                    //CIFRAR LA CONTRASEÑA
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;
                        //GUARDAR USUARIO
                        user.save((err, userStored) => {
                            if (err) {
                                return res.status(500).send({
                                    message: 'Error al gaurdar usuario'

                                });
                            }
                            if (!userStored) {
                                return res.status(400).send({
                                    message: 'El usuario no se ha guardado'

                                });
                            }
                            //DEVOLVER RESPUESTA
                            // return res.status(200).send({
                            //    status: 'success',
                            //   user: userStored
                            });
                        });



                        return res.status(200).send({
                            message: 'Usuario registrado con exito',
                            user

                        });
                    
                } else {
                    return res.status(500).send({
                        message: 'El usuario ya esta registrado'

                    });
                }
            });



        } else {
            return res.status(200).send({
                message: 'Validacion de los datos del usuario incorrecta'

            });
        }


    },
    login: function (req, res) {
        //RECOGER LOS PARAMETROS DE LA PETICION
        var params = req.body;

        //VALIDAR LOS DATOS
        try {
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }
        if (!validate_email || !validate_password) {
            return res.status(200).send({
                message: 'Los datos son incorrectos, envialos bien'
            });
        }
        //BUSCAR USUARIOS QUE COINCIDEN CON EL EMAIL
        User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    message: 'Error al intentar identificarse'

                });
            }
            if (!user) {
                return res.status(404).send({
                    message: 'El usuario no existe'
                });
            }

            //SI LO ENCUENTRA,

            //COMPROBAR LA CONTRASEÑA (COINCIDENCIA DE EMAIL Y PASSWORD / BCRYPT)
            bcrypt.compare(params.password, user.password, (err, check) => {
                //SI ES CORRECTO,
                if (check) {
                    //GENERAR TOKEN DE JWT Y DEVOLVER
                    if (params.getToken) {
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });

                    } else {


                        //LIMPIAR OBJETO
                        user.password = undefined;

                        //DEVOLVER USAURIO
                        return res.status(200).send({
                            status: 'success',
                            user
                        });
                    }

                } else {
                    return res.status(200).send({
                        message: 'Las credenciales no son correctas'
                    });
                }
            })
        });
    },

    update: function (req, res) {
        var params = req.body;
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        } catch (err) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }
        delete params.password;
        var userID = req.user.sub;

        if (req.user.email != params.email) {
            User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
                if (err) {
                    return res.status(500).send({
                        message: 'Error al intentar identificarse'

                    });
                }
                if (user && user.email == params.email) {
                    return res.status(200).send({
                        message: 'EL email no puede ser modificado'
                    });
                }else{
                    User.findOneAndUpdate({ _id: userID }, params, { new: true }, (err, userUpdated) => {

                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error al actualizar usuario'
                            });
                        }
                        if (!userUpdated) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error al actualizar usuario'
                            });
                        }
                        return res.status(200).send({
                            status: 'success',
                            user: userUpdated
                        });
                    });
                }
            });
        } else {

            User.findOneAndUpdate({ _id: userID }, params, { new: true }, (err, userUpdated) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar usuario'
                    });
                }
                if (!userUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar usuario'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            });
        }

    },


    uploadAvatar: function (req, res) {
        //CONFIGURAR EL MULTIPARTY

        //RECOGER EL FILE
        var file_name = 'Avatar..';
        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        //CONSEGUIR NOMBRE Y EXTENSION
        var file_path = req.files.file0.path;
        console.log(file_path);
        var file_split = file_path.split('/');

        var file_name = file_split[2];
             console.log(file_name);
        var ext_split = file_name.split('.');
        var file_ext = ext_split[1];
        console.log(file_ext);

        //COMPROBAR EXTENSION, BORRAR FILE SI NO ES VALIDA
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg') {
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension del archivo no es valida'
                });
            });


        } else {
            //SACAR ID DEL USUARIO IDENTIFICADO
            var userID = req.user.sub;
            // BUSCAR Y ACTUALIZAR EN BD
            User.findOneAndUpdate({ _id: userID }, { image: file_name }, { new: true }, (err, userUpdated) => {
                if (err || !userUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al guardar el usuario'

                    });
                }

                //RESPUESTA
                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });
            });



        }


    },

    avatar: function (req, res) {
        var fileName = req.params.fileName;
        var pathFile = './uploads/users/' + fileName;

        fs.exists(pathFile, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(pathFile));
            } else {
                return res.status(404).send({
                    message: 'La imagen no existe'
                });
            }
        });
    },

    getUsers: function (req, res){
        User.find().exec((err, users)=>{
            if(err || !users){

                return res.status(404).send({
                    status:'error',
                    message: 'No hay usuarios que mostrar'
                });
            }

            return res.status(200).send({
                status:'success',
                users
            });
        });


    },

    getUser: function (req, res){
        var userID=req.params.userID;

        User.findById(userID).exec((err,user)=>{
            if(err || !user){
                return res.status(404).send({
                    status:'error',
                    message: 'No existe el usuario'
                });
            }

            return res.status(200).send({
                status:'success',
                user
            });
        });

    }

};

module.exports = controller;
