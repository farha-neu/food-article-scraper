
$(document).on("click", ".delete", function() {
    console.log("clicked");
    $.ajax({
      method: "DELETE",
      url: "/delete",
      }).then(function(){
          // console.log(data);     
          location.reload();
      });
  })