
getArticles(true);

// Grab the articles as a json
function getArticles(isSaved){
$.getJSON("/articles/"+isSaved, function(data) {
  console.log(data);
  if(data.length>0)
  {
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        var divContainer =$("<div>").addClass("wrapper");
        var newsLink = $("<a>").attr("href",data[i].link);
        var headLine = $("<h2>").html(data[i].title);
        newsLink.html(headLine);
        var summary = $("<p>").html(data[i].summary);
        var img = $("<img class='img-thumbnail img-custom'>").attr("src",data[i].image);
        var saveBtn = $("<button class='save'>").addClass("btn btn-success");
       
       
        
        var button = $("<button id='saveBtn'>").html("remove from saved");
        button.attr("data-id", data[i]._id);
        button.attr("data-saved",!data[i].saveNote);
        var buttonNote = $("<button id='noteBtn'>").html("Add Notes");
        buttonNote.attr("data-id", data[i]._id);
        divContainer.append(newsLink,summary,img,button,buttonNote);
        $("#articles").append(divContainer);
       }
    }
    else{
      $("#articles").html("Uh Oh. Looks like we don't have any new articles saved.");
    }
});
}

$(document).on("click", "#saveBtn", function() {
  var articleId = $(this).attr("data-id");
  var saveNote = $(this).attr("data-saved");
  // $(this).parent().empty();
  $("#notes").empty();
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



// Whenever someone clicks a p tag
$(document).on("click", "#noteBtn", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/article/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // // If there's a note in the article
      if (data.note.length>0) {
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
  console.log("hi",$("#titleinput").val());
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
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
  $("#titleinput").val("");
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