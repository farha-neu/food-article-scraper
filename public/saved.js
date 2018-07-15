$.getJSON("/articles/true", function(data) {
  var articlesDiv = $(".articles");
  if(data.length>0){
  // For each one
  for (var i = 0; i < data.length; i++) {
    var articleDiv = $("<div>").addClass("col-md-12 mb-4 article");
    var row =$("<div>").addClass("row");

    var imageColumn = $("<div>").addClass("col-md-2 col-sm-12");
    var img = $("<img class='img-fluid image'>").attr("src",data[i].image);
    var imgLink = $("<a>").addClass("title").attr("href",data[i].link);
    imgLink.attr("target","_blank");
    imgLink.append(img);
    imageColumn.append(imgLink);

    var titleSummaryColumn =  $("<div>").addClass("col-md-7 col-sm-12");
    var newsLink = $("<a>").addClass("title").attr("href",data[i].link).html(data[i].title);
    newsLink.attr("target","_blank");
    var summary = $("<p>").addClass("summary mt-3").html(data[i].summary);
    var readmore = $("<a>").addClass("read-more").attr("href",data[i].link).html("Read More <i class='fas fa-chevron-circle-right'></i>");
    readmore.attr("target","_blank");
    titleSummaryColumn.append(newsLink,summary,readmore);

    var buttonColumn = $("<div>").addClass("col-md-3 col-sm-12");
    var button = $("<button>").addClass('saveBtn btn btn-danger btn-sm float-md-right float-center ml-md-2 mb-2');
    button.attr("data-id", data[i]._id);
    button.attr("data-saved",!data[i].isSaved);
    var buttonIcon = $("<img>").attr("src","/images/save.png");
    button.append(buttonIcon).html("Remove from Saved");

    var buttonNote = $("<button id='noteBtn'>").addClass('btn btn-info btn-sm float-md-right float-center mb-2');
    buttonNote.attr("data-toggle","modal");
    buttonNote.attr("data-target","#exampleModal");
    buttonNote.attr("data-id", data[i]._id);
    buttonNote.html("View/Add Notes");
    buttonColumn.append(button,buttonNote);

    row.append(imageColumn,titleSummaryColumn,buttonColumn);
    articleDiv.append(row);
    articlesDiv.append(articleDiv);
  }}
  else{
    var articleDiv = $("<div>").addClass("col-md-12 mb-4 article text-center");
    var row =$("<div>").addClass("row");
    var msgColumn =  $("<div>").addClass("col-md-12 msg");
    var msg = $("<p>").addClass("text-center").html("No saved articles found.");
    var optionIcon = $("<img>").attr("src","/images/option.png");
    var option = $("<a>").attr("href","/").addClass("scrape op").append(optionIcon,"Browse Articles");
    msgColumn.append(msg,option);
    row.append(msgColumn);
    articleDiv.append(row);
    articlesDiv.append(articleDiv);
  }
});

$(document).on("click", ".saveBtn", function() {
  console.log("click");
  var articleId = $(this).attr("data-id");
  var saveNote = $(this).attr("data-saved");
  $.ajax({
    method: "PUT",
    url: "/article/" + articleId+"/saved/"+saveNote,
    }).then(function(data){
        location.reload();
    });
})


$(document).on("click", "#noteBtn", function() {
  $(".modal-title").empty();
  $(".view-note").empty();
  $("#bodyinput").val("");
  console.log("clicked");
   var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/article/" + thisId
  })
    .then(function(data) {
      console.log(data);
      console.log(data.note.length);
      var viewNoteContainer = $(".view-note");
      if (data.note.length>=1) {
        for(var i = 0; i<data.note.length;i++){
          var noteDiv = $("<div>").addClass("note mb-2");
          noteDiv.append(data.note[i].body);
          var deleteBtn = $("<button>").addClass("btn btn-danger btn-sm noteDelete ml-2");
          var deleteIcon = $("<i>").addClass("fas fa-times");
          deleteBtn.attr("data-id", data.note[i]._id);
          deleteBtn.attr("data-aid", data._id);
          deleteBtn.append(deleteIcon);
          noteDiv.append(deleteBtn);
          viewNoteContainer.append(noteDiv);
        }
       }
       else{
         var noteDiv = $("<div>").addClass("note mb-2 text-center");
         noteDiv.append("No notes for this article yet.");
         viewNoteContainer.append(noteDiv);
       }
       $(".modal-title").append("Notes for article: " + data._id);
       $("#savenote").attr("data-id",data._id)
    });
 });

  $(".modal-footer").on("click", "#savenote", function() {
     var thisId = $(this).attr("data-id");
     console.log("hi",$("#bodyinput").val());
     if($("#bodyinput").val().trim()!==""){
          $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
              body: $("#bodyinput").val()
            }
          })
          .then(function(data) {
            console.log(data);
            location.reload();
          });
     }
  });


$(document).on("click", ".noteDelete", function() {
  console.log("clicked");
  var noteId = $(this).attr("data-id");
  var articleId = $(this).attr("data-aid");
  console.log(noteId);
  $.ajax({
    method: "DELETE",
    url: "/article/"+articleId+"/note/" + noteId,
    }).then(function(){    
        location.reload();
    });
})