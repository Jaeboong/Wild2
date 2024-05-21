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

const addComment = (id, comment) => {
  const post = getPostById(id);
  if (post) {
    post.comments.push(comment);
  }
};

const recommendComment = (postId, commentId) => {
  const post = getPostById(postId);
  if (post) {
    const comment = post.comments.find(comment => comment.id === commentId);
    if (comment) {
      comment.recommendations++;
    }
  }
};

module.exports = { getAllPosts, createPost, getPostById, votePost, recommendPost, addComment, recommendComment };
