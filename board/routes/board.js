const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // 예시 모델

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find(); // 게시물 목록 가져오기
        res.render('board', { posts }); // 게시물 목록을 board.ejs에 전달
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

