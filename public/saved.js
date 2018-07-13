$.getJSON("/articles/true", function(data) {
  var articlesDiv = $(".articles");
  if(data.length>0){
  // For each one
  for (var i = 0; i < data.length; i++) {
    var articleDiv = $("<div>").addClass("col-md-12 mb-4 article");
    var row =$("<div>").addClass("row");

    var imageColumn = $("<div>").addClass("col-md-2");
    var img = $("<img class='img-fluid image'>").attr("src",data[i].image);
    imageColumn.append(img);

    var titleSummaryColumn =  $("<div>").addClass("col-md-7");
    var newsLink = $("<a>").addClass("title").attr("href",data[i].link).html(data[i].title);
    var summary = $("<p>").addClass("summary mt-3").html(data[i].summary);
    titleSummaryColumn.append(newsLink,summary);

    var buttonColumn = $("<div>").addClass("col-md-3");
    var button = $("<button>").addClass('saveBtn btn btn-warning btn-sm');
    button.attr("data-id", data[i]._id);
    button.attr("data-saved",!data[i].isSaved);
    var buttonIcon = $("<img>").attr("src","/images/save.png");
    button.append(buttonIcon).html("Remove from saved");

    var buttonNote = $("<button id='noteBtn'>").addClass('btn btn-danger btn-sm ml-2');
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
    var msg = $("<p>").addClass("text-center").html("No articles saved. Browse available articles!");
    msgColumn.append(msg);
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
  $("#notes").empty();
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "GET",
    url: "/article/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // // If there's a note in the article
      if (data.note) {
        for(var i = 0; i<data.note.length;i++){
          var noteDiv = $("<div>").addClass("note-div");
          var note = $("<p>").html(data.note[i].body);
          var deleteNote = $("<button>").addClass("noteDelete").html("X");
          deleteNote.attr("data-id", data.note[i]._id);
          deleteNote.attr("data-aid", data._id);
          noteDiv.append(note,deleteNote)
          $("#notes").append(noteDiv);
        }
       }

      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // // An input to enter a new title
      // $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' rows='4' cols='50' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
    });
});

// When you click the savenote button
$("#notes").on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log("clicked");
  console.log("hi",$("#bodyinput").val());
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // // Also, remove the values entered in the input and textarea for note entry
  $("#bodyinput").val("");
});


$(document).on("click", ".noteDelete", function() {
  console.log("clicked");
  var noteId = $(this).attr("data-id");
  var articleId = $(this).attr("data-aid");
  console.log(noteId);
  // $(this).parent().empty(); 
  $.ajax({
    method: "DELETE",
    url: "/article/"+articleId+"/note/" + noteId,
    }).then(function(){
        // console.log(data);     
        location.reload();
    });
})