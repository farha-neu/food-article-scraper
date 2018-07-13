
$(document).on("click", ".delete", function() {
    console.log("clicked");
    $.ajax({
      method: "DELETE",
      url: "/delete",
      }).then(function(){   
          location.reload();
      });
  })