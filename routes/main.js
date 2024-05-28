const express = require('express');
const router = express.Router();
const Announcement = require('../models/announcement');
const Complain = require('../models/complain');
const asynchandler = require('express-async-handler');

// 최신 4개의 공지글, 민원 게시판 글 가져오기
router.get('/homepage', asynchandler(async (req, res) => {
  try {
    const announcement = await Announcement.findAll({
     order: [['createdAt', 'DESC']],
      limit: 4,
      attributes: ['id', 'title']
    });

    // const complains = await Complain.findAll({
    //   order: [['createdAt', 'DESC']],
    //   limit: 4,
    //   attributes: ['id', 'title']
    // });

    // res.json({ announcements, complains });
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

module.exports = router;