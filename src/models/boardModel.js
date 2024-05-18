const posts = [];

const getAllPosts = () => {
  return posts;
};

const createPost = (post) => {
  posts.push(post);
};

const getPostById = (id) => {
  return posts.find(post => post.id === parseInt(id));
};

const votePost = (id, voteType) => {
  const post = getPostById(id);
  if (voteType === 'for') {
    post.votes.for++;
  } else if (voteType === 'against') {
    post.votes.against++;
  }
};

const recommendPost = (id) => {
  const post = getPostById(id);
  post.recommendations++;
};

module.exports = { getAllPosts, createPost, getPostById, votePost, recommendPost };
