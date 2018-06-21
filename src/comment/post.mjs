import Post from "../post/Post.model.mjs";
import Comment from "./Comment.model.mjs";
import yup from "yup";
import { isObjectId } from "../utils";

const createPost = async (postId, owner, body, position) => {
  const schema = yup.object().shape({
    postId: yup.string().required().test(isObjectId),
    owner: yup.string().required(),
    body: yup.string().required(),
    position: yup.object().shape({
      x: yup.number().required(),
      y: yup.number().required(),
    }).required(),
  });

  try {
    await schema.validate({
      postId,
      owner,
      body,
      position,
    });
  } catch (err) {
    throw {
      status: 422,
      errors: err.errors
    };
  }
  
  const post = await Post.findById(postId);

  if (!post) {
    throw {
      status: 422,
      errors: [`cannot find user with id ${postId}`]
    };
  }

  const newComment = new Comment({
    owner,
    body,
    position,
  });

  post.comments.push(newComment);

  await newComment.save();
  await post.save();

  const comment = {
    id: newComment._id,
    position: newComment.position,
    date: newComment.date,
    username: newComment.owner,
    body: newComment.body,
  }

  return {
    ok: true,
    comment
  };
}

const expressPost = async (req, res) => {
  try {
    await createPost(req.params.postId, req.body.username, req.body.body, req.body.position);

    res.json({
      ok: true,
    });
  } catch ({ errors = [], status = 500 }) {
    return res.status(status).json({
      ok: false,
      errors,
    });
  }
}

export default expressPost;