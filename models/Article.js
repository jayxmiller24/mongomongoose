var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var ArticleSchema = new Schema({
 
  title: {
    type: String,
    required: true
  },
  
  link: {
    type: String,
    required: true
  },
  article: {
    type: String,
    required: true
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  articleCreated: {
    type: Date,
    default: Date.now
  },
  
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});


var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
