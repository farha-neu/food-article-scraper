$.getJSON("/articles/false", function(data) {
  var articlesDiv = $(".articles");
  if(data.length>0){
  // For each one
  for (var i = 0; i < data.length; i++) {
    var articleDiv = $("<div>").addClass("col-md-12 mb-4 article");
    var row =$("<div>").addClass("row");

    var imageColumn = $("<div>").addClass("col-md-2");
    var img = $("<img class='img-fluid image'>").attr("src",data[i].image);
    imageColumn.append(img);

    var titleSummaryColumn =  $("<div>").addClass("col-md-8");
    var newsLink = $("<a>").addClass("title").attr("href",data[i].link).html(data[i].title);
    var summary = $("<p>").addClass("summary mt-3").html(data[i].summary);
    titleSummaryColumn.append(newsLink,summary);

    var buttonColumn = $("<div>").addClass("col-md-2");
    var button = $("<button>").addClass('saveBtnbtn btn-warning btn-sm saveBtn');
    button.attr("data-id", data[i]._id);
    button.attr("data-saved",!data[i].isSaved);
    var buttonIcon = $("<img>").attr("src","/images/save.png");
    button.append(buttonIcon,"Save Article");
    buttonColumn.append(button);
    
    row.append(imageColumn,titleSummaryColumn,buttonColumn);
    articleDiv.append(row);
    articlesDiv.append(articleDiv);
  }}
  else{
    var articleDiv = $("<div>").addClass("col-md-12 mb-4 article text-center");
    var row =$("<div>").addClass("row");
    var msgColumn =  $("<div>").addClass("col-md-12 msg");
    var msg = $("<p>").addClass("text-center").html("No new articles found at this moment. Try scraping new articles!");
    msgColumn.append(msg);
    row.append(msgColumn);
    articleDiv.append(row);
    articlesDiv.append(articleDiv);
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

$(document).on("click", ".delete", function() {
  console.log("clicked");
  $.ajax({
    method: "DELETE",
    url: "/delete",
    }).then(function(){   
        location.reload();
    });
})