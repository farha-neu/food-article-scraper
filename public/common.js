
$(document).on("click", ".delete", function() {
    console.log("clicked");
    $.ajax({
      method: "DELETE",
      url: "/delete",
      }).then(function(){   
          location.reload();
      });
  })

  $(document).on("click", ".scrape", function() {
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function(data){
     window.location.href="/";
    });
  })
  