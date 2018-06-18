import mongoose from "mongoose";
import path from "path";

const postSchema = new mongoose.Schema({
  image: String,
  title: String,
  owner: String,
  comments: [mongoose.Schema.Types.ObjectId],
  date: {
    type: Date,
    default: Date.now
  },
});

postSchema.methods.getPostData = function(secure, host) {
  const image = secure ? "https" : "http" + "://" + path.join(host, "static", this.image);

  return {
    id: this._id,
    image,
    title: this.title,
    owner: this.owner,
    date: this.date.getTime(),
    commentsCount: this.comments.length
  }
}

const Post = mongoose.model("Post", postSchema);
export default Post;