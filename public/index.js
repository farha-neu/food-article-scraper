
$(document).ready(function() {
  getArticles(false);

// Grab the articles as a json

function getArticles(isSaved){
  // $.get("/scrape").then(function(data){
  //   console.log(data);
    $.getJSON("/articles/"+isSaved, function(data) {
      $("#articles").empty();
      // console.log(data);
      if(data.length>0)
      {
          // For each one
          for (var i = 0; i < data.length; i++) {
            //  container.append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
            var divContainer =$("<div>").addClass("wrapper");
            var newsLink = $("<a>").attr("href",data[i].link);
            var headLine = $("<h2>").html(data[i].title);
            newsLink.html(headLine);
            var summary = $("<p>").html(data[i].summary);
            var img = $("<img class='img-thumbnail img-custom'>").attr("src",data[i].image);

            var button = $("<button>").html("save article");
            button.attr("data-id", data[i]._id);
            button.attr("data-saved",!data[i].saveNote);
            divContainer.append(newsLink,summary,img,button);
            $("#articles").append(divContainer);
          }

        }
        else{
          $("#articles").html("Uh Oh. Looks like we don't have any new articles.");
        }
    // });
})}



$("#scrape").on("click",function(){
  $.get("/scrape").then(function(data){
    if(data){
      window.location.href("/");
    }
    
  });
});

$(document).on("click", "button", function() {
  var articleId = $(this).attr("data-id");
  var saveNote = $(this).attr("data-saved");
  // $(this).parent().empty();
  // NOT FINISHED :)
  $.ajax({
    method: "PUT",
    url: "/article/" + articleId+"/saved/"+saveNote,
    // data:{saved: saved}
    }).then(function(data){
        // console.log(data);      
        location.reload();
    });
})

});

