const mongoose = require("mongoose");
const slugify = require("slugify");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please Provide a title"],
    minlength: [10, "Please Provide a title at leaset 10 length"],
    unique: true,
  },
  content: {
    type: String,
    required: [true, "Please Provide a content"],
    minlength: [10, "Please Provide a content at leaset 20 length"],
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User",
  },
  likeCount : {
    type : Number,
    default : 0
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  answers : [
    {
      type : mongoose.Schema.ObjectId,
      ref:"Answer"
    }
  ],
  answerCount : {
    type : Number,
    default : 0
  }
});

QuestionSchema.pre("save", function (next) {
  if (!this.isModified("title")) {
    next();
  }
  this.slug = this.makeSluq();
  next();
});

QuestionSchema.methods.makeSluq = function () {
  return slugify(this.title, {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
  });
};

module.exports = mongoose.model("Question", QuestionSchema);
