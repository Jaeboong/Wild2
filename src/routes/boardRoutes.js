const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const Post = require("../models/Post");
const { getAllPosts, createPost, getPostById, votePost, recommendPost, addComment, recommendComment } = require('../models/boardModel');

router.get('/list', asyncHandler(async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.render('listBoard', { posts });
  } catch (error) {
    res.status(500).send('Error retrieving posts');
  }
}));

router.get('/create', asyncHandler(async(req, res) => {
  res.render('createBoard');
}));

router.post('/create', asyncHandler(async (req, res) => {
  const { author, title, content, voteTitle } = req.body;
  const newPost = {
    author,
    title,
    content,
    voteTitle,
    votesFor: 0,
    votesAgainst: 0,
    recommendations: 0,
    comments: []
  };
  await Post.create(newPost);
  res.redirect('/board/list');
}));

router.get('/view/:id', asyncHandler(async (req, res) => {
  const post = await getPostById(req.params.id);
  if (!post) {
    res.status(404).send('Post not found');
    return;
  }
  const hasVoted = req.session.votes && req.session.votes.includes(req.params.id);
  const hasRecommended = req.session.recommendations && req.session.recommendations.includes(req.params.id);
  const commentRecommendations = req.session.commentRecommendations || {};
  res.render('viewBoard', { post, hasVoted, hasRecommended, commentRecommendations });
}));

router.post('/vote/:id', asyncHandler(async (req, res) => {
  if (!req.session.votes) {
    req.session.votes = [];
  }

  if (!req.session.votes.includes(req.params.id)) {
    const { voteType } = req.body;
    await votePost(req.params.id, voteType);
    req.session.votes.push(req.params.id);
  }

  res.redirect(`/board/view/${req.params.id}`);
}));

router.post('/recommend/:id', asyncHandler(async (req, res) => {
  if (!req.session.recommendations) {
    req.session.recommendations = [];
  }

  if (!req.session.recommendations.includes(req.params.id)) {
    await recommendPost(req.params.id); 
    req.session.recommendations.push(req.params.id);
  }

  res.redirect(`/board/view/${req.params.id}`);
}));

router.post('/comment/:id', asyncHandler(async (req, res) => {
  const { author, comment } = req.body;
  const newComment = {
    author,
    content: comment,
    postId: req.params.id,
    recommendations: 0
  };
  try {
    await addComment(req.params.id, newComment);
    res.redirect(`/board/view/${req.params.id}`);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
}));

router.post('/comment/recommend/:postId/:commentId', asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;

  if (!req.session.commentRecommendations) {
    req.session.commentRecommendations = {};
  }

  if (!req.session.commentRecommendations[commentId]) {
    await recommendComment(postId, parseInt(commentId));
    req.session.commentRecommendations[commentId] = true;
  }

  res.redirect(`/board/view/${postId}`);
}));

router.use((req, res) => {
  res.status(404).send('Page not found');
});

router.get('/vote/data/:id', asyncHandler(async (req, res) => {
  const post = await getPostById(req.params.id);
  if (!post) {
    res.status(404).send('Post not found');
    return;
  }
  res.json({
    votesFor: post.votesFor,
    votesAgainst: post.votesAgainst
  });
}));



module.exports = router;
