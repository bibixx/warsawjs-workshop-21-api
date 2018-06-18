import Post from "./Post.model.mjs";

const getPosts = async (secure, host) => {
  const postsRaw = (await Post.find({})).map(p => p.getPostData(secure, host));

  const posts = postsRaw.map(p => ({
    id: p.id,
    image: p.image,
    title: p.title,
    owner: p.owner,
    date: p.date,
    commentsCount: p.commentsCount
  }));

  return posts;
}

const getPostsExpress = async (req, res) => {
  const posts = await getPosts(req.secure, req.get('host'));

  res.json({
    ok: true,
    posts: posts
  });
}

export default getPostsExpress;