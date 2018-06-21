import Post from "../post/Post.model.mjs";
import Comment from "./Comment.model.mjs";

const getPost = async (postId) => {  
  const post = await Post.findById(postId);

  if (!post) {
    throw {
      status: 422,
      errors: [`cannot find user with id ${postId}`]
    };
  }

  const comments =
    (await Promise.all(post.comments.map(c => Comment.findById(c))))
    .map(com => ({
      id: com._id,
      position: com.position,
      date: com.date,
      username: com.owner,
      body: com.body,
    }));

  return { comments };
}

const expressGet = async (req, res) => {
  try {
    const { comments } = await getPost(req.params.postId);

    res.json({
      ok: true,
      comments
    });
  } catch ({ errors = [], status = 500 }) {
    return res.status(status).json({
      ok: false,
      errors,
    });
  }
}

export default expressGet;