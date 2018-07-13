$.getJSON("/articles/false", function(data) {
  var articlesDiv = $(".articles");
  if(data.length>0){
  // For each one
  for (var i = 0; i < data.length; i++) {
    var articleDiv = $("<div>").addClass("col-md-12 mb-4 article");
    var row =$("<div>").addClass("row");

    var imageColumn = $("<div>").addClass("col-md-2");
    var img = $("<img class='img-fluid image'>").attr("src",data[i].image);
    var imgLink = $("<a>").addClass("title").attr("href",data[i].link);
    imgLink.attr("target","_blank");
    imgLink.append(img);
    imageColumn.append(imgLink);

    var titleSummaryColumn =  $("<div>").addClass("col-md-8");
    var newsLink = $("<a>").addClass("title").attr("href",data[i].link).html(data[i].title);
    newsLink.attr("target","_blank");
    var summary = $("<p>").addClass("summary mt-3").html(data[i].summary);
    var readmore = $("<a>").addClass("read-more").attr("href",data[i].link).html("Read More <i class='fas fa-chevron-circle-right'></i>");
    readmore.attr("target","_blank");
    titleSummaryColumn.append(newsLink,summary,readmore);

    var buttonColumn = $("<div>").addClass("col-md-2");
    var button = $("<button>").addClass('saveBtnbtn btn-success btn-sm saveBtn float-right');
    button.attr("data-id", data[i]._id);
    button.attr("data-saved",!data[i].isSaved);
    button.append("Save Article");
    buttonColumn.append(button);
    
    row.append(imageColumn,titleSummaryColumn,buttonColumn);
    articleDiv.append(row);
    articlesDiv.append(articleDiv);
  }}
  else{
    var articleDiv = $("<div>").addClass("col-md-12 mb-4 article text-center");
    var row =$("<div>").addClass("row");
    var msgColumn =  $("<div>").addClass("col-md-12 msg");
    var msg = $("<p>").addClass("text-center").html("No new articles found.");
    var optionIcon = $("<img>").attr("src","/images/option.png");
    var optionIconTwo = $("<img>").attr("src","/images/option.png");
    var optionOne = $("<a>").addClass("scrape op").append(optionIcon,"Try Scraping New Articles");
    var optionTwo = $("<a>").attr("href","/saved").addClass("op").append(optionIconTwo,"Browse Saved Articles");
    msgColumn.append(msg,optionOne,$("<br>"),optionTwo);
    row.append(msgColumn);
    articleDiv.append(row);
    articlesDiv.append(articleDiv);
  }
});



$(document).on("click", ".saveBtn", function() {
  var articleId = $(this).attr("data-id");
  var isSaved = $(this).attr("data-saved");
  $.ajax({
    method: "PUT",
    url: "/article/" + articleId+"/saved/"+isSaved,
    }).then(function(data){      
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