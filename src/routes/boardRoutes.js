const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const path = require('path');
const checkLogin = require('../../middleware/auth');
const { User, Post, Comment, Recommend, Report, Vote } = require('../index');
const { Op } = require('sequelize');
const { getAllPosts, createPost, getPostById, votePost, recommendPost, addComment, recommendComment } = require('../models/boardModel');

const bodyParser = require('body-parser'); //여기부터 추가함
const cors = require('cors');
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// 로그인 페이지
router.get('/login', (req, res) => {
  const filePath = path.join(__dirname, '../views', 'login.html');
  res.sendFile(filePath);
});

// 회원가입 페이지
router.get('/sign-up', (req, res) => {
  const filePath = path.join(__dirname, '../views', 'sign-up.html');
  res.sendFile(filePath);
});

// 로그인 처리
router.post('/login', async function(req, res) {
  const userid = req.body.userid; // 올바르게 수정된 부분
  const password = req.body.password;

  try {
    const user = await User.findOne({ where: { userid: userid } });
    if (!user) {
      return res.status(401).send('없는 정보입니다');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({
        username: user.username, 
        id: user.userid, 
        pw: user.password
        }, 
        jwtSecret, {
          expiresIn: '1h'
        });
      res.cookie('token', token, { httpOnly: true });

      return res.json({token});
    } else {
      return res.status(401).send('비밀번호가 일치하지 않습니다');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// 회원가입 처리
router.post('/signup', async function(req, res) {
  const userid = req.body.userid; // userid 필드 추가
  const username = req.body.username; // name을 username으로 변경
  const password = req.body.pw;
  const confirmPassword = req.body.cpw;

  // 모두 입력 안하는 경우
  if (!userid || !username || !password || !confirmPassword) {
    return res.status(400).send('정보를 모두 입력하세요');
  }

  // 비밀번호가 다른 경우
  if (password !== confirmPassword) {
    return res.status(400).send('비밀번호가 일치하지 않습니다');
  }

  try {
    // 아이디 중복 확인
    const existingUser = await User.findOne({ where: { userid: userid } });
    if (existingUser) {
      return res.status(400).send('이미 사용 중인 아이디입니다.');
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // DB 저장 (username 추가됨)
    const newUser = await User.create({ userid: userid, username: username, password: hashedPassword }); // 수정된 부분
    return res.status(201).send('회원가입이 완료되었습니다.')
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// 로그아웃 처리
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// 핫 게시물 목록
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

// 공지 게시판 목록
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

// 신고 게시판 목록
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

// 민원 게시판 목록
router.get('/board/complain', checkLogin, asyncHandler(async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.render('listBoard', { posts });
  } catch (error) {
    res.status(500).send('Error retrieving posts');
  }
}));

// 게시물 작성 페이지
router.get('/board/create', checkLogin, asyncHandler(async(req, res) => {
  res.render('createBoard');
}));

// 게시물 작성 처리
router.post('/board/create', checkLogin, asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  const userid = req.user.id; // req.user.id를 사용하여 userid 설정

  const newPost = {
    userid, // userid를 추가
    title,
    content,
    category,
    recommend: 0,
    reports: 0,
    date: new Date(),
  };
  await createPost(newPost);
  res.redirect('/board/complain');
  console.log("post creat success");
}));

// 게시물 보기
router.get('/board/view/:id', checkLogin, asyncHandler(async (req, res) => {
  const post = await getPostById(req.params.id);
  if (!post) {
    res.status(404).send('Post not found');
    return;
  }

  // 작성자의 이름 가져오기
  const author = await User.findByPk(post.userid);
  post.authorName = author ? author.username : 'Unknown';

  // 댓글 작성자의 이름 가져오기
  const commentsWithAuthors = await Promise.all(post.comments.map(async comment => {
    const commentAuthor = await User.findByPk(comment.userid);
    return {
      ...comment,
      authorName: commentAuthor ? commentAuthor.username : 'Unknown'
    };
  }));

  const hasVoted = req.session.votes && req.session.votes.includes(req.params.id);
  const hasRecommended = req.session.recommendations && req.session.recommendations.includes(req.params.id);
  const commentRecommendations = req.session.commentRecommendations || {};
  res.render('viewBoard', { post, comments: commentsWithAuthors, hasVoted, hasRecommended, commentRecommendations });
}));

// 게시물 투표 처리
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

// 게시물 추천 처리
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

// 댓글 작성 처리
router.post('/board/comment/:id', checkLogin, asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const userid = req.user.id;

  try {
    const author = await User.findByPk(userid);

    if (!author) {
      return res.status(400).send('사용자를 찾을 수 없습니다.');
    }

    const newComment = {
      userid,
      postid: req.params.id,
      comment,
    };

    await addComment(req.params.id, newComment);
    res.redirect(`/board/view/${req.params.id}`);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
}));

// 댓글 추천 처리
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

// 페이지가 존재하지 않는 경우
router.use((req, res) => {
  res.status(404).send('Page not found');
});

// 투표 데이터 가져오기
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
