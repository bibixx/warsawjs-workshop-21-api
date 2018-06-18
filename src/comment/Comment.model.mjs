import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  owner: String,
  body: String,
  date: {
    type: Date,
    default: Date.now
  },
  position: {
    x: Number,
    y: Number
  }
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;