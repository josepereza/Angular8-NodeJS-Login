'use strict'
var validator = require('validator');
var Topic = require('../models/topic');
var controller = {
    save: function (req, res) {
        var params = req.body;

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
        } catch (err) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }
        if (validate_title && validate_content && validate_lang) {
            //CREAR OBJETO DE TOPIC
            var topic = new Topic();

            //ASIGNAR VALORES AL OBJETO
            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang = params.lang;
            topic.user = req.user.sub;

            //GUARDAR TOPIC
            topic.save((err, topicStored) => {
                if (err || !topicStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El tema no se ha guardado'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    topic: topicStored
                });
            });
        } else {
            return res.status(200).send({
                message: 'Validacion de los datos del topic incorrecta'

            });
        }

    },

    getTopics: function (req, res) {
        //CARGAR LIBRERIA DE PAGINACION EN  EL MODELO


        //RECOGER PAGINA ACTUAL
        if (!req.params.page || req.params.page == null || req.params.page == undefined || req.params.page == 0 || req.params.page == "0" || req.params.page == '0') {
            var page = 1;
        } else {
            var page = parseInt(req.params.page);
        }


        //INDICAR OPCIONES DE PAGINACION

        var options = {
            sort: { date: -1 },
            populate: 'user',
            limit: 5,
            page: page
        }

        //FIND PAGINADO
        Topic.paginate({}, options, (err, topics) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al hacer la consulta'
                });
            }
            if (!topics) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay topics'
                });
            }

            //DEVOLVER RESULTADO (TOPICS, TOTAL DE TOPIC, TOTAL DE PAGINAS)
            return res.status(200).send({
                status: 'success',
                topics: topics.docs,
                totalDocs: topics.totalDocs,
                totalPages: topics.totalPages

            });
        });
    },

    getTopicsByUser: function (req, res) {
        //CONSEGUIR ID DEL USUARIO
        var userID = req.params.user;

        //FIND CON LA CONDICION DEL ID
        Topic.find({
            user: userID
        }).sort([['date', 'descending']]).exec((err, topics) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }
            if (!topics) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay temas para mostrar'
                });
            }


            return res.status(200).send({
                status: 'success',
                topics
            });

        })
    },

    getTopic: function (req, res) {
        var topicID = req.params.id;

        Topic.findById(topicID).populate('user').populate('comments.user').exec((err, topic) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }
            if (!topic) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el tema'
                });
            }
            return res.status(200).send({
                status: 'success',
                topic
            });

        });

    },

    update: function(req, res){
        var topicID= req.params.id;

        var params= req.body;

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
        } catch (err) {
            return res.status(200).send({
                message: 'Faltan datos por enviar'
            });
        }

        

        if (validate_title && validate_content && validate_lang) {
            var update = {
                title: params.title,
                content: params.content,
                code: params.code,
                lang:  params.lang
            };
            Topic.findOneAndUpdate({ _id: topicID, user: req.user.sub }, update, {new:true}, (err, topicUpdated)=>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion'
                    });
                }
                if(!topicUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No se ha actualizado el tema'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    topic: topicUpdated
                });
            })
        }else{
            return res.status(200).send({
                message: 'Validacion de los datos del topic incorrecta'

            });
        }
    },

    delete: function(req, res){
        var topicID= req.params.id;

        Topic.findByIdAndDelete({_id: topicID, user: req.user.sub}, (err, topicRemoved)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }
            if(!topicRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el tema'
                });
            }
            return res.status(200).send({
                status: 'success',
                topic: topicRemoved
            });
        });
    },

    search: function(req,res){
        var searchString =  req.params.search;

        Topic.find({"$or" : [
            {"title": { "$regex": searchString, "$options": "i"}},
            {"content": { "$regex": searchString, "$options": "i"}},
            {"code": { "$regex": searchString, "$options": "i"}},
            {"lang": { "$regex": searchString, "$options": "i"}}
        ]})
        .populate('user')
        .exec((err, topics)=>{
            if(err){
            return res.status(500).send({
                status: 'error',
                message: 'Error en la peticion'
            });
        }
        if(!topics){
            return res.status(404).send({
                status: 'error',
                message: 'No hay temas disponibles'
            });
        }
        return res.status(200).send({
            status: 'success',
            topics
        });

        });
    }



};

module.exports = controller;