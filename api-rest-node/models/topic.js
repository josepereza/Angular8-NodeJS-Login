var mongoose = require('mongoose');
var mongoosePaginate= require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

//Modelo de Comment
var CommentSchema = Schema({
    content: String,
    date: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User'}
});

var Comment = mongoose.model('Comment', CommentSchema);

//Modelo de Topic
var TopicSchema = Schema({
    title: String,
    content: String,
    code: String,
    lang: String,
    date: { type: Date, default: Date.now},
    user: { type: Schema.ObjectId, ref: 'User'},
    comments: [CommentSchema]
});

//CARGAR PAGINACION
TopicSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Topic', TopicSchema);