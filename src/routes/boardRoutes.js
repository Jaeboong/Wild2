const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { getAllPosts, createPost, getPostById, votePost, recommendPost, addComment, recommendComment } = require('../models/boardModel');

router.get('/list', asyncHandler(async (req, res) => {
  const posts = getAllPosts();
  res.render('listBoard', { posts });
}));

router.get('/create', (req, res) => {
  res.render('createBoard');
});

router.post('/create', asyncHandler(async (req, res) => {
  const { author, title, content, voteTitle } = req.body;
  const newPost = {
    id: Date.now(),
    author,
    title,
    content,
    voteTitle,
    votes: { for: 0, against: 0 },
    recommendations: 0,
    comments: []
  };
  createPost(newPost);
  res.redirect('/board/list');
}));

router.get('/view/:id', asyncHandler(async (req, res) => {
  const post = getPostById(req.params.id);
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
    votePost(req.params.id, voteType);
    req.session.votes.push(req.params.id);
  }

  res.redirect(`/board/view/${req.params.id}`);
}));

router.post('/recommend/:id', asyncHandler(async (req, res) => {
  if (!req.session.recommendations) {
    req.session.recommendations = [];
  }

  if (!req.session.recommendations.includes(req.params.id)) {
    recommendPost(req.params.id);
    req.session.recommendations.push(req.params.id);
  }

  res.redirect(`/board/view/${req.params.id}`);
}));

router.post('/comment/:id', asyncHandler(async (req, res) => {
  const { author, comment } = req.body;
  const newComment = {
    id: Date.now(),
    author,
    content: comment,
    recommendations: 0
  };
  addComment(req.params.id, newComment);
  res.redirect(`/board/view/${req.params.id}`);
}));

router.post('/comment/recommend/:postId/:commentId', asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;

  if (!req.session.commentRecommendations) {
    req.session.commentRecommendations = {};
  }

  if (!req.session.commentRecommendations[commentId]) {
    recommendComment(postId, parseInt(commentId));
    req.session.commentRecommendations[commentId] = true;
  }

  res.redirect(`/board/view/${postId}`);
}));

router.use((req, res) => {
  res.status(404).send('Page not found');
});

module.exports = router;
