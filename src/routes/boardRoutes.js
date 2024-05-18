const express = require('express');
const router = express.Router();
const { getAllPosts, createPost } = require('../models/boardModel');


router.get('/list', (req, res) => {
  const posts = getAllPosts();
  res.render('listBoard', { posts });
});


router.get('/create', (req, res) => {
  res.render('createBoard');
});


router.post('/create', (req, res) => {
  const { author, title, content } = req.body;
  const newPost = {
    id: Date.now(),
    author,
    title,
    content,
    votes: { for: 0, against: 0 },
  };
  createPost(newPost);
  res.redirect('/board/list');
});

router.get('/view/:id', (req, res) => {
  const posts = getAllPosts();
  const post = posts.find(p => p.id === parseInt(req.params.id));
  res.render('viewBoard', { post });
});

module.exports = router;
