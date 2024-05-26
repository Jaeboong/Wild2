const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const Post = require("../models/Post");
const path = require('path');
const checkLogin = require('../../middleware/auth');
const{ User } = require('../index');
const { Op } = require('sequelize');
const { getAllPosts, createPost, getPostById, votePost, recommendPost, addComment, recommendComment } = require('../models/boardModel');


router.get('/login', (req, res) => {
  const filePath = path.join(__dirname, '../views', 'login.html');
  res.sendFile(filePath);
});

router.get('/sign-up', (req, res) => {
  const filePath = path.join(__dirname, '../views', 'sign-up.html');
  res.sendFile(filePath);
});

router.post('/login', async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).send('없는 정보입니다');
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {

      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });

      return res.redirect('/board/complain');
    } else {
      return res.status(401).send('비밀번호가 일치하지 않습니다');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// 회원가입
router.post('/sign-up', async function(req, res) {
  const name = req.body.fName + req.body.lName;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.psw;
  const confirmPassword = req.body.cPsw;

  // 모두 입력 안하는 경우
  if (!name || !phone || !email || !password || !confirmPassword) {
    return res.status(400).send('정보를 모두 입력하세요');
  }

  // 비밀번호가 다른 경우
  if (password !== confirmPassword) {
    return res.status(400).send('비밀번호가 일치하지 않습니다');
  }

  try {
    // 이메일 또는 전화번호 중복 확인
    const existingUser = await User.findOne({ where: { [Op.or]: [{ email: email }, { phone: phone }] } });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).send('이미 사용 중인 이메일입니다.');
      } else if (existingUser.phone === phone) {
        return res.status(400).send('이미 사용 중인 전화번호입니다.');
      }
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // db저장
    const newUser = await User.create({ name, phone, email, password: hashedPassword });
    return res.status(201).send('회원가입이 완료되었습니다.')
  } catch (err) {
    console.error(err);
    // 기타 오류 처리
    return res.status(500).send('Internal server error');
  }

});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

/////////////////////////////////////////////

router.get(
  ["/board/hot"],
  asyncHandler(async (req, res) => {
      const locals = {
          title: "Hot",
      };
      const data = await Post.findAll({
          attributes: ['title', 'body', 'author', 'createdAt']
      });
      res.render("hot", { locals, data, layout: mainLayout });
  })
);

// 공지 게시판
router.get(
  ["/board/announce"],
  asyncHandler(async (req, res) => {
      const locals = {
          title: "Notice",
      };
      const data = await Post.findAll({
          attributes: ['title', 'body', 'author', 'createdAt']
      });
      res.render("notice", { locals, data, layout: mainLayout });
  })
);


// 신고 목록
router.get(
  ["/board/reportList"],
  asyncHandler(async (req, res) => {
      const locals = {
          title: "Reports",
      };
      const data = await Post.findAll({
          attributes: ['title', 'body', 'author', 'createdAt']
      });
      res.render("reports", { locals, data, layout: mainLayout });
  })
);

/////////////////////////////////////////////

router.get('/board/complain', checkLogin, asyncHandler(async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.render('listBoard', { posts });
  } catch (error) {
    res.status(500).send('Error retrieving posts');
  }
}));

router.get('/board/create', checkLogin, asyncHandler(async(req, res) => {
  res.render('createBoard');
}));

router.post('/board/create', checkLogin, asyncHandler(async (req, res) => {
  const { title, content, voteTitle } = req.body;
  const author = req.user.id;
  const newPost = {
    author,
    title,
    content,
    voteTitle,
    category, 
    votesFor: 0,
    votesAgainst: 0,
    recommendations: 0,
    comments: []
  };
  await Post.create(newPost);
    // 선택한 카테고리에 따라 리다이렉트
    if (category === 'complain') {
      res.redirect('/board/complain');
    } else if (category === 'report') {
      res.redirect('/board/announce');
    } else {
      res.redirect('/board/complain');  // 기본적으로 민원게시판으로 리다이렉트
    }
}));

router.get('/board/view/:id', checkLogin, asyncHandler(async (req, res) => {
  const post = await getPostById(req.params.id);
  if (!post) {
    res.status(404).send('Post not found');
    return;
  }
  
  // 작성자의 이름 가져오기
  const author = await User.findByPk(post.author);
  post.authorName = author ? author.name : 'Unknown';

  // 댓글 작성자의 이름 가져오기
  const commentsWithAuthors = await Promise.all(post.comments.map(async comment => {
    const commentAuthor = await User.findByPk(comment.author);
    return {
      ...comment,
      authorName: commentAuthor ? commentAuthor.name : 'Unknown'
    };
  }));

  const hasVoted = req.session.votes && req.session.votes.includes(req.params.id);
  const hasRecommended = req.session.recommendations && req.session.recommendations.includes(req.params.id);
  const commentRecommendations = req.session.commentRecommendations || {};
  res.render('viewBoard', { post, comments: commentsWithAuthors, hasVoted, hasRecommended, commentRecommendations });
}));

router.post('/board/vote/:id', checkLogin, asyncHandler(async (req, res) => {
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

router.post('/board/recommend/:id', checkLogin, asyncHandler(async (req, res) => {
  if (!req.session.recommendations) {
    req.session.recommendations = [];
  }

  if (!req.session.recommendations.includes(req.params.id)) {
    await recommendPost(req.params.id); 
    req.session.recommendations.push(req.params.id);
  }

  res.redirect(`/board/view/${req.params.id}`);
}));

router.post('/board/comment/:id', checkLogin, asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const authorId = req.user.id;  // 로그인된 사용자의 ID를 가져옵니다.

  try {
    // 로그인된 사용자의 이름을 가져옵니다.
    const author = await User.findByPk(authorId);

    if (!author) {
      return res.status(400).send('사용자를 찾을 수 없습니다.');
    }


    const newComment = {
      author: authorId,
      authorName: author.name,  // 작성자의 이름 저장
      content: comment,
      postId: req.params.id,
      recommendations: 0
    };

    await addComment(req.params.id, newComment);
    res.redirect(`/board/view/${req.params.id}`);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
}));

router.post('/board/comment/recommend/:postId/:commentId', asyncHandler(async (req, res) => {
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
