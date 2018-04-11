const cheerio = require('cheerio');
const request = require('request');
const url = 'https://www.gumtree.com.au/s-photography-video/c18448';

request(url, function(err, res, html) {
    console.log(html);
    const $ = cheerio.load(html);
    results = [];
    for (i=0;i<31;i++) {
        results.push({
            title: $('.user-ad-row__title').eq(i).text(),
            description: $('.user-ad-row__description').eq(i).text(),
            location: $('.user-ad-row__location-area').eq(i).text(),
            age: $('.user-ad-row__age').eq(i).text(),
            image: $('.user-ad-row__image').eq(i).attr('src'),
            link: $('.user-ad-row').eq(i).attr('href'),
        })
    }
    console.log(results);
    console.log(results.length);
});