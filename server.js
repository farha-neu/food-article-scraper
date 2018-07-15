// https://farha-neu.github.io/Bootstrap-Portfolio/

var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();
 
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to the Mongo DB
var databaseUri = "mongodb://localhost/scraperDb";
if(process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI);
}
else{
  mongoose.connect(databaseUri);
}
var dbConnect = mongoose.connection;

dbConnect.on('error',function(err){
  console.log("Mongoose error: ",err);
})

dbConnect.once('open',function(){
  console.log("Mongoose connection successful");
})


app.get("/scrape", function(req, res) {
  axios.get("https://www.washingtonpost.com/food/").then(function(response) {
    var $ = cheerio.load(response.data);
    $(".story-list-story").each(function(i, element) {
      var result = {};
      var newsLink = $(element).find(".story-image").find("a").attr("href");
      var imgLink = $(element).find(".story-image").find("a").find("img").attr("data-hi-res-src");
      var headLine =  $(element).find(".story-headline").find("h3").text();
      var summary =  $(element).find(".story-description").find("p").text();
     
      result.title = headLine;
      result.link = newsLink;
      result.image = imgLink;
      result.summary = summary;
      db.Article.create(result)
        .then(function(dbArticle) {
           console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          // return res.json(err);
          console.log(err);
        });
    });
    res.send("scrape complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles/:saved", function(req, res) {
  db.Article.find({isSaved:req.params.saved}).populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/article/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id },{$push: {note: dbNote._id} }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//saving/unsaving articles
app.put("/article/:id/saved/:saved",function(req,res){
  db.Article.update({_id:req.params.id},{$set:{isSaved:req.params.saved}},{ new: true }).then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
     res.json(err);
  })
})

app.delete("/article/:id/note/:noteId",function(req,res){
  db.Note.findByIdAndRemove(req.params.noteId).then(function(){
      return db.Article.update({ _id: req.params.id }, {$pull: {note:req.params.noteId}});
  }).then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.delete("/delete",function(req,res){
  db.Note.remove({}).then(function(){
    return db.Article.remove({});
  }).then(function(){
    res.json("Deleted");
  })
  .catch(function(err) {
    res.json(err);
  });
})

app.get("/saved", function(req, res) {
  res.sendFile(path.join(__dirname, "public/saved.html"));
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
