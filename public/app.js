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
                $(".input").append("<textarea id='bodyInput' name='body'></textarea>");

                if (result.note) {
                    
                    $("#bodyInput").val(result.note.body);
    
                }
            });
    });



    // When you click the Save Note button
    $(document).on("click", "#savenote", function () {
        // Grab the id associated with the article from the submit button
        var thisId = $(this).attr("data-id");
        console.log(thisId);

        // Run a POST request to change the note, using what's entered in the inputs
        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })

            .done(function (result) {
                // Log the response
                console.log(result);
                // Empty the notes section
                // $("#bodyinput").empty();
            });

        // Remove the values entered in the input and textarea for note entry
        $("#bodyinput").val("");
    });



    $(document).on("click", ".scrape-new", function () {
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).done(function (result) {
            location.reload();
        })
    })

    // When you click the Note button
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










