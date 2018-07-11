var parentContainer = $("div.container");
$.get("/scrape",function(data){
    console.log(data);
    parentContainer.empty();
    $.get("/all",function(result){
        console.log(result);
        for(var i = 0; i<result.length; i++){
            var divContainer = $("<div>");
            var newsLink = $("<a>").attr("href",result[i].newsLink);
            var headLine = $("<h2>").html(result[i].headLine);
            newsLink.html(headLine);
            var summary = $("<p>").html(result[i].summary);
            var img = $("<img class='img-thumbnail img-custom'>").attr("src",result[i].imgLink);
            var saveBtn = $("<button class='save'>").addClass("btn btn-success");
            saveBtn.append("Save Article");
            divContainer.append(newsLink,summary,img,saveBtn);
            parentContainer.append(divContainer);
        }
    });
})

$(".container").on("click",".save",function(){
       $(this).parent().remove();
       console.log("saved");
       //update db with id
       //make saved = 1
});