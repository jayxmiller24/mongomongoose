$(document).ready(function () {
    $.getJSON("/articles", function (result) {
        for (var i = 0; i < result.length; i++) {


            $("#articles").append("<div class='col-sm-12' style='margin-bottom:60px;'><div class='card'><div class='card-body'><a class='title-link' href='" + result[i].link + "'><h5>" + result[i].title + "</h5></a><hr><p class='card-text'>" + result[i].article + "</p><button data-id='" + result[i]._id + "' class='btn-note btn btn-outline-primary btn-sm'  data-toggle='modal' data-target='#noteModal' style='margin-right:10px;'>Note</button><button data-id='" + result[i]._id + "' class='btn-add btn btn-outline-primary btn-sm'  data-toggle='modal' data-target='#myModal' style='margin-right:10px;'>Add Note</button></div></div></div>"
            );
        }

        console.log(result);
    });


    $(document).on("click", ".btn-note", function () {

        $(".modal-title").empty();
            $(".input").empty();
        var thisId = $(this).attr("data-id");
        

        $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })

            .then(function (result) {
                
                $(".modal-title").append("<h5>" + result.title + "</h5>");
                $(".input").append("<textarea id='bodyInput' name='body'>" + result.note.body + "</textarea>");
                
                if (result.notes.body === false) {
                    $("#bodyInput").val("Put your note in the other modal please")
                    //$("#bodyInput").val(result.note.body);
                    
    
                }
            });
    });



   
    $(document).on("click", "#savenote", function () {
        
        var thisId = $(this).attr("data-id");
        console.log(thisId);

        
        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                
                body: $("#bodyinput").val()
            }
        })

            .done(function (result) {
                
                console.log(result);
                
            });

        
        $("#bodyinput").val("");
    });



    $(document).on("click", ".scrape-new", function () {
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).done(function (result) {

            console.log(result)
            location.reload(true);
        })
        
    })
    

    
    $(document).on("click", ".btn-add", function () {
        $(".modal-title").empty();
        $(".input").empty();
        var thisId = $(this).attr("data-id");
        $.ajax({
            method: "Get",
            url: "/articles/" + thisId
        }).done(function (result) {
            $(".modal-title").empty();
            $(".input").empty();

            $(".modal-title").append("<h5>" + result.title + "</h5>");
            $(".input").append("<textarea id='bodyinput' name='body'></textarea>");
            $(".input").append("<button data-id='" + result._id + "' id='savenote' class='btn btn-primary btn-sm' style='margin-top:20px;'data-dismiss='modal'>Save Note</button>");

        })
    })
})










