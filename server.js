// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");


var app = express();

app.use(logger("dev"));
// Setup the app with body-parser and a static folder
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(express.static("public"));

// Database configuration
var databaseUrl = "foodscrapper";
var collections = ["scrappedData"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);

// Log any mongojs errors to console
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Routes
// ======

// Simple index route
// app.get("/", function(req, res) {
//   res.send(public/index.html);
// });


// HTML ROUTES
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/html/index.html"));
});
app.get("/saved", function(req, res) {
  res.sendFile(path.join(__dirname, "public/html/saved.html"));
});

//API ROUTES

  // Retrieve data from the db
  app.get("/all", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.scrappedData.find({saved:0}, function(error, found) {
      // Throw any errors to the console
      if (error) {
        console.log(error);
      }
      // If there are no errors, send the data to the browser as json
      else {
        console.log(found);
        res.json(found);
      }
    });
  });


app.get("/scrape",function(req,res){
  var result = [];
  request("https://www.washingtonpost.com/food/",function(error,response,html){
    var $ = cheerio.load(html);
    $(".story-list-story").each(function(i, element) {
        var newsLink = $(element).find(".story-image").find("a").attr("href");
        var imgLink = $(element).find(".story-image").find("a").find("img").attr("data-hi-res-src");
        var headLine =  $(element).find(".story-headline").find("h3").text();
        var summary =  $(element).find(".story-description").find("p").text();
         result.push({newsLink,imgLink,headLine,summary});
    // });
        console.log(result);
    //insert into db
        db.scrappedData.update({newsLink:newsLink},
          {$setOnInsert: 
            {
              imgLink:imgLink,
              headLine:headLine,
              summary:summary,
              saved : 0
            }},{upsert:true},function(){});
     })
    res.json("ok");
   });
  });

// Update just one note by an id
app.post("/update/:id", function(req, res) {
  // When searching by an id, the id needs to be passed in
  // as (mongojs.ObjectId(IdYouWantToFind))

  // Update the note that matches the object id
  db.notes.update(
    {
      _id: mongojs.ObjectId(req.params.id)
    },
    {
      // Set the title, note and modified parameters
      // sent in the req body.
      $set: {
        title: req.body.title,
        note: req.body.note,
        modified: Date.now()
      }
    },
    function(error, edited) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(edited);
        res.send(edited);
      }
    }
  );
});


// Delete One from the DB


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
