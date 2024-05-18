const express = require('express');
const router = express.Router();
const { getAllPosts, createPost, getPostById, votePost, recommendPost } = require('../models/boardModel');

router.get('/list', (req, res) => {
  const posts = getAllPosts();
  res.render('listBoard', { posts });
});

router.get('/create', (req, res) => {
  res.render('createBoard');
});

router.post('/create', (req, res) => {
  const { author, title, content, voteTitle } = req.body;
  const newPost = {
    id: Date.now(),
    author,
    title,
    content,
    voteTitle,
    votes: { for: 0, against: 0 },
    recommendations: 0,
  };
  createPost(newPost);
  res.redirect('/board/list');
});

router.get('/view/:id', (req, res) => {
  const post = getPostById(req.params.id);
  const hasVoted = req.session.votes && req.session.votes.includes(req.params.id);
  const hasRecommended = req.session.recommendations && req.session.recommendations.includes(req.params.id);
  res.render('viewBoard', { post, hasVoted, hasRecommended });
});

router.post('/vote/:id', (req, res) => {
  if (!req.session.votes) {
    req.session.votes = [];
  }

  if (!req.session.votes.includes(req.params.id)) {
    const { voteType } = req.body;
    votePost(req.params.id, voteType);
    req.session.votes.push(req.params.id);
  }

  res.redirect(`/board/view/${req.params.id}`);
});

router.post('/recommend/:id', (req, res) => {
  if (!req.session.recommendations) {
    req.session.recommendations = [];
  }

  if (!req.session.recommendations.includes(req.params.id)) {
    recommendPost(req.params.id);
    req.session.recommendations.push(req.params.id);
  }

  res.redirect(`/board/view/${req.params.id}`);
});

module.exports = router;
