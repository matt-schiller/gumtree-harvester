// Dependencies
const express = require('express');
const router = express.Router();
const db = require('../models');
const request = require('request');
const rp = require('request-promise-native');
const cheerio = require('cheerio');


// Get index
router.get('/', function(req, res) {
    var ads = db.Ad.find({}).sort({createdAt: -1}).exec(function(err, data){
        res.render('index', { ads: data });
    });
});

// Get individual page
router.get('/ad/:id', function(req, res) {
    var ads = db.Ad.findOne({gumtree_id: req.params.id}).populate('comments').exec(function(err, data){
        console.log(data.comments);
        res.render('ad', data);
    });
});

// Fetch
router.get('/fetch', function(req, res) {
    const options = {
        uri: 'https://www.gumtree.com.au/s-photography-video/c18448',
        transform: function (body){ return cheerio.load(body); }
    }
    rp(options)
    .then(function($) {
        results = [];
        $('.user-ad-row').each(function(i) {
            result = {
                gumtree_id: $('.user-ad-row').eq(i).attr('href').substr($('.user-ad-row').eq(i).attr('href').length - 10),
                title: $('.user-ad-row__title').eq(i).text(),
                description: $('.user-ad-row__description').eq(i).text(),
                location: $('.user-ad-row__location-area').eq(i).text(),
                age: $('.user-ad-row__age').eq(i).text(),
                image: $('.user-ad-row__image').eq(i).attr('src'),
                link: $('.user-ad-row').eq(i).attr('href'),
                saved: false
            };
            results.push(result);
        });
        Promise.all(results.map(result => Promise.resolve(
            db.Ad.findOneAndUpdate({gumtree_id: result.gumtree_id}, result, {upsert:true}, function(err, doc){
                if(err) { console.log(err); }
            })
        )))
        .then(function() {
            res.send("Done");
        });
    })
});

// Save ad
router.get('/save/:id', function(req, res) {
    db.Ad.findOne({gumtree_id: req.params.id}, function(err, doc) {
        if (err) throw err;
        db.Ad.update({gumtree_id: req.params.id}, {$set: {saved: !doc.saved}}, function(err, doc) {
            if (err) throw err;
            res.send("Done");
        });
    });
});

// Create comment
router.post('/comment/:id', function(req, res) {
    db.Comment.create({
        comment: req.body.comment,
        ad: req.params.id
    }, function(err, doc) {
        if (err) throw err;
        db.Ad.findOneAndUpdate({_id: req.params.id}, {$push: {comments: doc._id}}, function() {
            console.log("ref created");
            res.json({"message": "Done"});
        });
    });
});

// Delete comment
router.delete('/comment/:id', function(req, res) {
    db.Comment.find({_id: req.params.id}).remove(function(err, doc) {
        if (err) throw err;
        res.send("Done");
    });
});

// Delete ads
router.delete('/ad/:id', function(req, res) {
    db.Ad.find({gumtree_id: req.params.id}).remove(function(err, doc) {
        if (err) throw err;
        res.send("Done");
    });
});

// Export routes
module.exports = router;



