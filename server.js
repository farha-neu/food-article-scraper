// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");
var path = require("path");


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
 var collections = ["articles"];

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


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
