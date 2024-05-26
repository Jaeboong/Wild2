const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcement');
const Board = require('../models/board');
const asynchandler = require('express-async-handler');

// 최신 4개의 공지글 가져오기
router.get('/home', asynchandler(async (req, res) => {
  const announcements = await Announcement.findAll({
    order: [['createdAt', 'DESC']],
    limit: 4,
    attributes: ['id', 'title']
  });
  
  res.json(announcements);
}));

// 최신 4개의 민원 게시판글 가져오기
router.get('/home', asynchandler(async (req, res) => {
    const boards = await Board.findAll({
      order: [['createdAt', 'DESC']],
      limit: 4,
      attributes: ['id', 'title']
    });
    
    res.json(boards);
  }));

module.exports = router;
