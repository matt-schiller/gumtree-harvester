var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AdSchema = new Schema({
    gumtree_id: Number,
    title: String,
    description: String,
    location: String,
    age: String,
    image: String,
    link: String,
    saved: Boolean,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
},{
    timestamps: true
})

var Ad = mongoose.model('Ad', AdSchema);

module.exports = Ad;
