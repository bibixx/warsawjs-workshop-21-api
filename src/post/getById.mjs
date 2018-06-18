import Post from "./Post.model.mjs";
import Comment from "../comment/Comment.model.mjs";
import yup from "yup";
import { isObjectId } from "../utils";

const getPostById = async (id, secure, host) => {
  const schema = yup.object().shape({
    id: yup.string().required().test(isObjectId),
  });

  try {
    await schema.validate({
      id: id,
    });
  } catch (err) {
    throw {
      status: 422,
      errors: err.errors,
    };
  }
  
  const postRaw = await Post.findById(id);

  await Comment.findById(postRaw.comments[0]);

  const comments = await Promise.all(postRaw.comments.map((com) => Comment.findById(com)));

  if (!postRaw) {
    throw { status: 404 };
  }

  const postData = postRaw.getPostData(secure, host);

  const post = {
    id: postData._id,
    image: postData.image,
    title: postData.title,
    owner: postData.owner,
    date: postData.date,
    comments: comments,
  };

  return post;
}

const getPostByIdExpress = async (req, res) => {
  try {
    const post = await getPostById(req.params.id, req.secure, req.get('host'));
  
    res.json({
      ok: true,
      post: post
    });
  } catch ({ status = 500, errors }) {
    if (status === 404) {
      return res.status(404).send();
    }

    return res.status(status).json({
      ok: false,
      errors: errors
    });
  }
}

export default getPostByIdExpress;