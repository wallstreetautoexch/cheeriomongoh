/* Showing Mongoose's "Populated" Method (18.3.8)
 * INSTRUCTOR ONLY
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/week18day31mongoose");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

// A GET request to scrape the echojs website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  // request("http://www.foxnews.com/", function(error, response, html) {
  //   // Then, we load that into cheerio and save it to $ for a shorthand selector
  //   var $ = cheerio.load(html);
  //   var rrr = cheerio.load(html);
  //  console.log(html) 

  //    $('h2.&nbsp').each(function(i, element){
  //     var a = $(this).children();
  //     console.log("a" +a)
  //    // console.log(ul.text());
  request('https://news.ycombinator.com', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $('span.comhead').each(function(i, element){
      var a = $(this).prev();
      var rank = a.parent().parent().text();
      var title = a.text();
      var url = a.attr('href');
      var subtext = a.parent().parent().next().children('.subtext').children();
      var points = $(subtext).eq(0).text();
      var username = $(subtext).eq(1).text();
      var comments = $(subtext).eq(2).text();
      // Our parsed meta data object
      var metadata = {
        rank: parseInt(rank),
        title: title,
        url: url,
        points: parseInt(points),
        username: username,
        comments: parseInt(comments)
      };
      console.log(metadata);
    });
  }
});
     });
    


// request('http://foxnews.com', function (error, response, html) {
//   // if (!error) {
//     var $ = cheerio.load(html);
//     $('h2.&nbsp').each(function(i, element){
//       var a = $(this).next();
//       // console.log(a.text());
//       console.log("i" +i)
//       console.log(element)
//     });
//   // }
// });



    // Now, we grab every h2 within an article tag, and do the following:

  //   // $("article h2").each(function(i, element) {
  //   $("article body").each(function(i, element) {
  //     // Save an empty result object
  //     var result = {};

  //     // Add the text and href of every link, and save them as properties of the result object
  //     result.title = $(this).children("url").text();
  //     result.link = $(this).children("url").attr("href");

  //     // Using our Article model, create a new entry
  //     // This effectively passes the result object to the entry (and the title and link)
  //     var entry = new Article(result);

  //     // Now, save that entry to the db
  //     entry.save(function(err, doc) {
  //       // Log any errors
  //       if (err) {
  //         console.log(err);
  //       }
  //       // Or log the doc
  //       else {
  //         console.log(doc);
  //       }
  //     });

  //   });
  // });
  // Tell the browser that we finished scraping the text
  // res.send("Scrape Complete");

  console.log("2")

app.listen(3000, function() {
  console.log("App running on port 3000!");
  });