var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");



var db = require("./models");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraperDB";
mongoose.connect(MONGODB_URI);
mongoose.Promise = Promise;



// Require all models
var db = require("./models");

// Initialize Express
var PORT = process.env.PORT || 3000;

var app = express();



app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect("mongodb://localhost/scraperDB", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {

    axios.get("https://www.ign.com/articles?tags=news").then(function (response) {

        var $ = cheerio.load(response.data);
        let result = {};

        $("div.listElmnt-blogItem").each(function (i, element) {

           result.title = $(element).children(".listElmnt-storyHeadline").text();
            result.article = $(element).find("p").text();
            result.link = $(element).children("p").children("a").attr("href");

            console.log(result);

            db.Article.create(result).then(function (dbArticle) {

                console.log(dbArticle);

            }).catch(function (err) {
                res.json(err);
            });
            db.Article.find({}).then(function(dbArticle){
                res.json(dbArticle);
            })
            .catch(function(err){
                res.json(err);
            })
        });

    });
});
app.get("/notes", function (req, res) {

    db.Note.find({})
        .then(function (dbNote) {

            res.json(dbNote);
        })
        .catch(function (err) {

            res.json(err);
        });
});

app.get("/articles", function (req, res) {

    db.Article.find({})
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});

app.post("/submit", function (req, res) {
    // Create a new Note in the db
    db.Note.create(req.body)
        .then(function (dbNote) {

            return db.Article.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
        })
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});


app.get("/articles/:id", function (req, res) {

    db.Article.findOne({ _id: req.params.id })

        .populate("note")
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});


app.post("/articles/:id", function (req, res) {

    db.Note.create(req.body)
        .then(function (dbNote) {

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });

})



app.put("/delete/:id", function (req, res) {

    db.Article
        .findByIdAndUpdate({ _id: req.params.id }, { $set: { isSaved: false } })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});