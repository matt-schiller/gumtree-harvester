var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    comment: String,
    ad: { type: Schema.Types.ObjectId, ref: 'Ad' },
},{
    timestamps: true
})

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
