// Grab the articles as a json
$.getJSON("/articles/false", function(data) {
  if(data.length>0){
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var divContainer =$("<div>").addClass("wrapper");
    var newsLink = $("<a>").attr("href",data[i].link);
    var headLine = $("<h2>").html(data[i].title);
    newsLink.html(headLine);
    var summary = $("<p>").html(data[i].summary);
    var img = $("<img class='img-thumbnail img-custom'>").attr("src",data[i].image);

    var button = $("<button>").addClass('saveBtn').html("save article");
    button.attr("data-id", data[i]._id);
    button.attr("data-saved",!data[i].isSaved);
    divContainer.append(newsLink,summary,img,button);
    $("#articles").append(divContainer);
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }}
  else{
    $("#articles").html("Uh Oh. Looks like we don't have any new articles at this moment.");
  }
});

$(document).on("click", "#scrape", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function(data){
    // console.log(data);
  //  getArticles(false);
   location.reload();
  });
})

$(document).on("click", ".saveBtn", function() {
  var articleId = $(this).attr("data-id");
  var isSaved = $(this).attr("data-saved");
  // $(this).parent().empty();
  // NOT FINISHED :)
  $.ajax({
    method: "PUT",
    url: "/article/" + articleId+"/saved/"+isSaved,
    // data:{saved: saved}
    }).then(function(data){
        // console.log(data);      
        location.reload();
    });
})

