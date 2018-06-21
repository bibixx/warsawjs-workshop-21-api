import yup from "yup";
import fs from "fs";
import Post from "./Post.model.mjs";

const createPost = async (req, res) => {
  try {
    const bodySchema = yup.object().shape({
      username: yup.string().required(),
      title: yup.string().required(),
    });

    await bodySchema.validate(req.body);
    if (!req.file) {
      throw {
        errors: ["image is a required filed"]
      };
    }
  } catch (err) {
    if (req.file) {
      console.log(req.file.path);

      try {
        fs.unlink(req.file.path, () => {});
      } catch (err) {
        console.log(err);
      }
    }

    return res
      .status(422)
      .json({
        ok: false,
        error: err.errors
      });
  }

  const { username, title } = req.body;

  const post = new Post({
    owner: username,
    image: req.file.filename,
    title: title,
  });

  await post.save();

  const postDataRaw = post.getPostData();

  const postData = {
    id: postDataRaw.id,
    image: postDataRaw.image,
    title: postDataRaw.title,
    owner: postDataRaw.owner,
    date: postDataRaw.date,
    commentsCount: postDataRaw.commentsCount
  };

  return res.json({
    ok: true,
    post: postData
  });
}

export default createPost;