const posts = [];

const getAllPosts = () => {
  return posts;
};

const createPost = (post) => {
  posts.push(post);
};

module.exports = { getAllPosts, createPost };
