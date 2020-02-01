'use strict'

var express = require('express');
var CommentController= require('../controllers/comment');

var router = express.Router();
var md_auth= require('../middlewares/authenticated');

//RUTAS DE COMMENT
router.post('/comment/topic/:topicID', md_auth.authenticated, CommentController.add);
router.put('/comment/:commentID', md_auth.authenticated, CommentController.update);
router.delete('/comment/:topicID/:commentID',  md_auth.authenticated, CommentController.delete);


module.exports = router;