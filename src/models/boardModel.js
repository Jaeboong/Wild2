const Post = require('./Post');
const Comment = require('./Comments');
const Recommend = require('./Recommend');
const Report = require('./report');
const Vote = require('./vote');

const getAllPosts = async () => {
  try {
    const posts = await Post.findAll(); 
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

const createPost = async (post) => {
  try {
    await Post.create(post); 
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

const getPostById = async (id) => {
  try {
    const post = await Post.findByPk(id, {
      include: [{ model: Comment, as: 'comments' }]
    });
    return post;
  } catch (error) {
    console.error('Error fetching post by id:', error);
    throw error;
  }
};

const votePost = async (id, voteType) => {
  try {
    const post = await getPostById(id); 
    if (!post) return;

    if (voteType === 'agree') {
      post.votesFor++; 
    } else if (voteType === 'disagree') {
      post.votesAgainst++; 
    }
    await post.save(); 
  } catch (error) {
    console.error('Error voting post:', error);
    throw error;
  }
};

const recommendPost = async (id) => {
  try {
    const post = await getPostById(id); 
    if (!post) return;

    post.recommend++; 
    await post.save(); 
  } catch (error) {
    console.error('Error recommending post:', error);
    throw error;
  }
};

const addComment = async (id, comment) => {
  try {
    const post = await getPostById(id);
    if (!post) return;

    await Comment.create({ ...comment, postid: id });
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

const recommendComment = async (postId, commentId) => {
  try {
    const post = await getPostById(postId);
    if (!post) return;

    const comment = await Comment.findOne({ where: { id: commentId, postid: postId } });
    if (comment) {
      comment.recommendations++;
      await comment.save(); 
    }
  } catch (error) {
    console.error('Error recommending comment:', error);
    throw error;
  }
};

module.exports = { getAllPosts, createPost, getPostById, votePost, recommendPost, addComment, recommendComment };
