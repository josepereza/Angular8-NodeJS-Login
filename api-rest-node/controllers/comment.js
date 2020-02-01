'use strict'
var validator = require('validator');
var Topic = require('../models/topic');
var controller = {

    add: function (req, res) {
        var topicID = req.params.topicID;

        Topic.findById(topicID).exec((err, topic) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }
            if (!topic) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el topic'
                });
            }

            if (req.body.content) {
                try {
                    var validate_content = !validator.isEmpty(req.body.content);

                } catch (err) {
                    return res.status(200).send({
                        message: 'No has comentado nada'
                    });
                }

                if (validate_content) {

                    var comment = {
                        user: req.user.sub,
                        content: req.body.content
                    };

                    topic.comments.push(comment);

                    topic.save((err) => {
                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error al guardar el comentario'
                            });
                        }

                        Topic.findById(topic._id).populate('user').populate('comments.user').exec((err, topic) => {
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

                       
                    });

                } else {
                    return res.status(200).send({
                        message: 'No se han validado los datos del comentario'

                    });
                }

            }

        });

    },

    update: function (req, res) {

        var commentID = req.params.commentID;

        var params = req.body;

        try {
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                message: 'No has comentado nada'
            });
        }
        if (validate_content) {
            Topic.findOneAndUpdate(
                { "comments._id": commentID },
                {
                    "$set": {
                        "comments.$.content": params.content
                    }
                },
                {new: true}, (err, topicUpdated)=>{
                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error en la peticion'
                        });
                    }
                    if(!topicUpdated){
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe el tema'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        topic: topicUpdated
                    });
                });
        }
    },

    delete: function (req, res) {

        var topicID= req.params.topicID;
        var commentID= req.params.commentID;

        Topic.findById(topicID, (err, topic)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }
            if(!topic){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el tema'
                });
            }

            var comment= topic.comments.id(commentID);

            if(comment){
                comment.remove();

                topic.save((err)=>{
                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error en la peticion'
                        });
                    }
                    Topic.findById(topic._id).populate('user').populate('comments.user').exec((err, topic) => {
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
                })


            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el comentario'
                });
            }
        });
    }
};

module.exports = controller;