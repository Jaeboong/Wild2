const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const path = require('path');
const { User, Post, Comment, Recommend, Report, Vote } = require('../index');
const { Op } = require('sequelize');
const { getAllPosts, createPost, getPostById, votePost, recommendPost, addComment, recommendComment } = require('../models/boardModel');

const bodyParser = require('body-parser'); //여기부터 추가함
const cors = require('cors');
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let postid = 14;


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
  const userid = req.body.userid;
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
        isAdmin: user.isAdmin
        }, 
        jwtSecret, {
          expiresIn: '1h'
        });
      res.cookie('token', token, { httpOnly: true });

      return res.json({token});
    } else {
      return res.status(402).send('비밀번호가 일치하지 않습니다');
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
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;

  // 모두 입력 안하는 경우
  if (!userid || !username || !password || !confirmPassword || !email || !phoneNumber) {
    return res.status(401).send('정보를 모두 입력하세요');
  }

  // 비밀번호가 다른 경우
  if (password !== confirmPassword) {
    return res.status(402).send('비밀번호가 일치하지 않습니다');
  }

  try {
    // 아이디 중복 확인
    const existingUserById = await User.findOne({ where: { userid: userid } });
    if (existingUserById) {
      return res.status(403).send('이미 사용 중인 아이디입니다.');
    }

    // 이메일 중복 확인
    const existingUserByEmail = await User.findOne({ where: { email: email } });
    if (existingUserByEmail) {
      return res.status(403).send('이미 사용 중인 이메일입니다.');
    }

    // 전화번호 중복 확인
    const existingUserByPhone = await User.findOne({ where: { phoneNumber: phoneNumber } });
    if (existingUserByPhone) {
      return res.status(403).send('이미 사용 중인 전화번호입니다.');
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // DB 저장 (username, email, phoneNumber 추가됨)
    const newUser = await User.create({
      userid: userid,
      username: username,
      password: hashedPassword,
      email: email,
      phoneNumber: phoneNumber
    });
    
    return res.status(201).send('회원가입이 완료되었습니다.');
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

// 홈페이지
router.get('/homepage', async (req, res) => {
  const { category } = req.query;
  let filteredPosts;

  if(category === "hot"){
    filteredPosts = await Post.findAll({
      where: {
        recommend: { [Op.gte]: 10 } 
      },
      order: [['date', 'DESC']],
      limit: 4,
      attributes: ['postid','title','recommend'] 
    });
  }
  else{
    filteredPosts = await Post.findAll({
      order: [['date', 'DESC']],
      where: {
        category: 'announce'
      },
      limit: 4,
      attributes: ['postid','title','recommend']
    });
  }

    res.json({ filteredPosts }); 
});

// 핫 게시물 목록
router.get(
  ["/board/hot"],
  asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;
      const { count, rows } = await Post.findAndCountAll({
        attributes: ['postid', 'title', 'content', 'userid', 'recommend', 'date'],
          where: {
              recommend: {
                  [Op.gte]: 10 // 추천수가 10 이상인 게시물만 가져옴
              }
          },
          order: [
            ['date', 'DESC'],
            ['postid', 'DESC']
          ],
          limit: limit,
          offset: offset,
          include: [
            {
              model: User,
              attributes: ['username'], // username만 포함
            }
          ],
        });
        
        const posts = rows.map(post => ({
          postid: post.postid,
          title: post.title,
          content: post.content,
          username: post.User.username, // User 모델에서 가져온 username
          recommend: post.recommend,
          date: post.date
        }));
    
        res.json({ total: count, posts: posts });
      })
);

// 공지 게시판 목록
router.get(
  ["/board/announce"],
  asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Post.findAndCountAll({
      attributes: ['postid', 'title', 'content', 'userid', 'recommend', 'date'],
      where: {
        category: 'announce'
      },
      order: [
        ['date', 'DESC'],
        ['postid', 'DESC']
      ],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          attributes: ['username'], // username만 포함
        }
      ],
    });
    
    const posts = rows.map(post => ({
      postid: post.postid,
      title: post.title,
      content: post.content,
      username: post.User.username, // User 모델에서 가져온 username
      recommend: post.recommend,
      date: post.date
    }));

    res.json({ total: count, posts: posts });
  })
);

// 제보 게시판 목록
router.get(
  ["/board/report"],
  asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Post.findAndCountAll({
      attributes: ['postid', 'title', 'content', 'userid', 'recommend', 'date'],
      where: {
        category: 'report'
      },
      order: [
        ['date', 'DESC'],
        ['postid', 'DESC']
      ],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          attributes: ['username'], // username만 포함
        }
      ],
    });
    
    const posts = rows.map(post => ({
      postid: post.postid,
      title: post.title,
      content: post.content,
      username: post.User.username, // User 모델에서 가져온 username
      recommend: post.recommend,
      date: post.date
    }));

    res.json({ total: count, posts: posts });
  })
);

// 민원 게시판 목록
router.get(
  ["/board/complain"],
  asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Post.findAndCountAll({
      attributes: ['postid', 'title', 'content', 'userid', 'recommend', 'date'],
      where: {
        category: 'complain'
      },
      order: [
        ['date', 'DESC'],
        ['postid', 'DESC']
      ],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          attributes: ['username'], // username만 포함
        }
      ],
    });
    
    const posts = rows.map(post => ({
      postid: post.postid,
      title: post.title,
      content: post.content,
      username: post.User.username, // User 모델에서 가져온 username
      recommend: post.recommend,
      date: post.date
    }));

    res.json({ total: count, posts: posts });
  })
);

//내 게시글 보기(로그인 하고)
router.get(
  ["/board/mypost"],
  asyncHandler(async (req, res) => {
    const { page = 1, userid } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;
      const { count, rows } = await Post.findAndCountAll({
        attributes: ['postid', 'title', 'content', 'userid', 'recommend', 'date'],
        where: {
          userid: userid
        },
        order: [
          ['date', 'DESC'],
          ['postid', 'DESC']
        ],
        limit: limit,
        offset: offset,
        include: [
          {
            model: User,
            attributes: ['username'], // username만 포함
          }
        ],
      });
      
      const posts = rows.map(post => ({
        postid: post.postid,
        title: post.title,
        content: post.content,
        username: post.User.username, // User 모델에서 가져온 username
        recommend: post.recommend,
        date: post.date
      }));
  
      res.json({ total: count, posts: posts });
    })
);

// 신고10번이상 된 글 목록
router.get(
  ["/board/ban"],
  asyncHandler(async (req, res) => {
    const { page = 1 } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Post.findAndCountAll({
      attributes: ['postid', 'title', 'content', 'userid', 'recommend', 'date'],
      where: {
        category: 'ban'
      },
      order: [
        ['date', 'DESC'],
        ['postid', 'DESC']
      ],
      limit: limit,
      offset: offset,
      include: [
        {
          model: User,
          attributes: ['username'], // username만 포함
        }
      ],
    });
    
    const posts = rows.map(post => ({
      postid: post.postid,
      title: post.title,
      content: post.content,
      username: post.User.username, // User 모델에서 가져온 username
      recommend: post.recommend,
      date: post.date
    }));

    res.json({ total: count, posts: posts });
  })
);


// 내 추천 목록
router.get(
  "/board/myrecommend",
  asyncHandler(async (req, res) => {
    const { page = 1, userid } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
      const { count, rows } = await Post.findAndCountAll({
        attributes: ['postid', 'title', 'content', 'userid', 'recommend', 'date'],
        include: [
          {
            model: Recommend,
            as: 'Recommends',
            where: {
              userid: userid
            },
            include: [
              {
                model: User,
                attributes: ['username']
              }
            ]
          }
        ],
        order: [['date', 'DESC']],
        limit: limit,
        offset: offset
      });

      const posts = rows.map(post => ({
        postid: post.postid,
        title: post.title,
        content: post.content,
        userid: post.userid,
        recommend: post.recommend,
        date: post.date,
        username: post.Recommends.length > 0 ? post.Recommends[0].User.username : null // username 추가
      }));

      res.json({ total: count, posts: posts });
    } catch (error) {
      console.error('Error fetching recommended posts:', error);
      res.status(500).send('추천한 게시글 목록을 가져오는 중 오류가 발생했습니다.');
    }
  })
);

//게시글 검색
router.get('/board/search', asyncHandler(async (req, res) => {
  const { query: searchKeyword, category, userid, page = 1 } = req.query;
  const keyword = searchKeyword || '';
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
        const whereConditions = {
          [Op.or]: [
            { title: { [Op.like]: `%${keyword}%` } },
            { userId: { [Op.like]: `%${keyword}%` } }
          ]
        };

      if (category === 'hot') {
          whereConditions.recommend = { [Op.gte]: 10 };
      } else if (category === 'mypost') {
          whereConditions.userid = userid;
      } else {
          whereConditions.category = category;
      }

      const results = await Post.findAndCountAll({
          where: whereConditions,
          attributes: ['postid', 'title', 'content', 'userid', 'recommend', 'date'],
          order: [['date', 'DESC'], ['postid', 'DESC']],
          limit,
          offset
      });

      res.json({ total: results.count, posts: results.rows });
  } catch (err) {
      console.error('Error searching posts:', err);
      res.status(500).send({ error: '검색 중 오류가 발생했습니다.' });
  }
}));

// 게시물 작성 페이지
router.get('/board/create',  asyncHandler(async(req, res) => {
  res.render('createBoard');
}));

// 게시글 작성 코드 수정
router.post('/board/create', asyncHandler(async (req, res) => {
  const { title, content, category, userid, needVote, voteTitle } = req.body;

  const newPost = {
    postid: postid++,
    userid,
    title,
    content,
    category,
    recommend: 0,
    reports: 0,
    date: new Date(),
    needVote: needVote,
    voteTitle: voteTitle,
  };

  try {
    await createPost(newPost);
    res.status(200).send({ message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send({ error: '게시물 작성 중 오류가 발생했습니다.' });
  }
}));

// 게시글 조회

  router.get('/board/view/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    console.log(id);
    
    const post = await Post.findByPk(id, {
      include: [
        {
          model: Comment,
          as: 'Comments',
          include: [
            {
              model: User,
              as: 'User', 
              attributes: ['username']
            }
          ]
        }
      ]
    });
  
    if (!post) {
      res.status(404).send('Post not found');
      return;
    }

    
  
    // 작성자의 이름 가져오기
    const author = await User.findByPk(post.userid);
    post.dataValues.authorName = author ? author.username : 'Unknown';
  
    // 댓글 작성자의 이름 가져오기
    const commentsWithAuthors = post.Comments.map(comment => {
      return {
        ...comment.dataValues,
        authorName: comment.User ? comment.User.username : 'Unknown'
      };
    });

      // Vote 모델에서 userid와 postid가 존재하는지 검사
      const userId = req.query.userid; // 쿼리 파라미터에서 userid를 가져옴
      const voteExists = await Vote.findOne({
        where: {
          postid: id,
          userid: userId
        }
      });

    const hasVoted = voteExists ? true : false;

    const reportExists = await Report.findOne({
      where: {
        postid: id,
        userid: userId
      }
    });

    const hasReported = reportExists ? true : false;

    // Recommend 모델에서 userid, postid로 추천이 존재하는지 검사
    const recommendExists = await Recommend.findOne({
      where: {
        postid: id,
        userid: userId
      }
    });

    const hasRecommended = recommendExists ? true : false;

        // Vote 모델에서 해당 postid에 대한 agree와 disagree 수를 계산
    const agreeCount = await Vote.count({
        where: {
            postid: id,
            agree: true
         }
    });
  
    const disagreeCount = await Vote.count({
        where: {
            postid: id,
            disagree: true
        }
    });

    const needVote = post.needVote;
    const voteTitle = post.voteTitle;

    res.json({
      post: post.dataValues,
      author: author.username,
      comments: commentsWithAuthors,
      hasVoted,
      hasRecommended,
      hasReported,
      agreeCount,
      disagreeCount,
      needVote,
      voteTitle,
  });

  }));

  // 게시글 삭제 라우트
router.delete('/post/:id', asyncHandler(async (req, res) => {
  const { id } = req.params; 

  try {
    await Comment.destroy({ where: { postid: id } });
    await Report.destroy({ where: { postid: id } });
    await Recommend.destroy({ where: { postid: id } });
    await Vote.destroy({ where: { postid: id } });

    await Post.destroy({ where: { id } });

    res.status(200).send('게시글이 정상적으로 삭제되었습니다.');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('게시글 삭제 중 오류가 발생했습니다.');
  }
}));

// 게시글 수정 라우트
router.put('/post/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const [updated] = await Post.update(
      { title, content },
      { where: { id } }
    );

    if (updated) {
      res.status(200).send('게시글이 정상적으로 수정되었습니다.');
    } else {
      res.status(404).send('게시글을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).send('게시글 수정 중 오류가 발생했습니다.');
  }
}));

// 게시물 투표 처리
router.post('/board/vote/:id', asyncHandler(async (req, res) => {
    const postid = req.params.id;
    const { userid, checked } = req.body;

    if (!userid || !checked) {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    try {
        // 투표 정보 저장
        const vote = await Vote.create({
            postid,
            userid,
            agree: checked === 'agree' ? true : false,
            disagree: checked === 'disagree' ? true : false
        });

        res.status(200).json({ message: 'Vote recorded successfully', vote });
    } catch (error) {
        console.error("Error recording vote:", error);
        res.status(500).json({ error: 'Error recording vote' });
    }
}));

// 게시물 추천 처리
router.post('/board/recommend/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.query.userid;

  const existingRecommend = await Recommend.findOne({
      where: {
          postid: id,
          userid: userId
      }
  });

  if (existingRecommend) {
      await existingRecommend.destroy();
      await Post.increment('recommend', { by: -1, where: { id: id } });
      res.json({ recommended: false }); // 추천 취소됨
  } else {
      await Recommend.create({ postid: id, userid: userId });
      await Post.increment('recommend', { by: 1, where: { id: id } });
      res.json({ recommended: true }); // 추천 추가됨
  }
}));

// 댓글 작성 처리
router.post('/board/comment/:id', asyncHandler(async (req, res) => {
  const { content, userid } = req.query; // req.query에서 content와 userid를 받아옴

  try {
    const author = await User.findByPk(userid); // userid를 사용하여 User를 찾음

    if (!author) {
      return res.status(400).send('사용자를 찾을 수 없습니다.');
    }

    // content 값이 null인지 확인
    if (!content) {
      return res.status(400).send('댓글 내용을 입력하세요.');
    }

    const newComment = {
      userid,
      postid: req.params.id,
      comment: content, // content 값을 comment로 설정
    };

    await Comment.create(newComment); // Comment 생성
    res.status(200).send('comment success');
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
}));

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

// 게시글 신고 처리
router.post('/board/reported/:id', asyncHandler(async (req, res) => {
  const { userid } = req.query; // 사용자 ID를 쿼리 파라미터로 받음
  const postid = req.params.id; // 게시글 ID를 경로 매개변수로 받음

  try {
    const author = await User.findByPk(userid); // 사용자 확인

    if (!author) {
      return res.status(400).send('사용자를 찾을 수 없습니다.');
    }

    // Report 모델에 신고 기록 추가
    await Report.create({
      postid,
      userid,
    });

    // 해당 게시글의 신고 수 계산
    const reportCount = await Report.count({ where: { postid } });

    // 신고 수가 10개 이상이면 게시글의 category를 'ban'으로 변경
    if (reportCount >= 10) {
      await Post.update({ category: 'ban' }, { where: { id: postid } });
    }

    res.status(200).send('신고가 접수되었습니다.');
  } catch (error) {
    console.error('Error reporting post:', error);
    res.status(500).send('신고 처리 중 오류가 발생했습니다.');
  }
}));

// 개인 정보 수정
router.put('/updateUser', async (req, res) => {
  const { userid, username, pw, email, phoneNumber } = req.body;

  try {
    let updateData = { username, email, phoneNumber };
    if (pw) {
      const hashedPassword = await bcrypt.hash(pw, 10);
      updateData.password = hashedPassword; // 비밀번호 해시 추가
    }

    // userid가 수정 불가능하므로 해당 필드를 제외하고 업데이트
    const result = await User.update(
      updateData,
      { where: { userid: userid } }
    );

    if (result[0] > 0) {
      console.log('User updated successfully');
      res.json({ success: true });
    } else {
      console.log('No rows updated');
      res.json({ success: false, message: 'No rows updated' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 회원탈퇴 deleteUser DELETE 요청
router.delete('/user', async (req, res) => {
  const { id } = req.body;

  try {
      // userid를 사용하여 해당 사용자의 정보를 삭제
      const result = await User.destroy({ where: { userid: id } });

      if (result > 0) {
          console.log('User deleted successfully');
          res.json({ success: true });
      } else {
          console.log('No user found');
          res.json({ success: false, message: 'No user found' });
      }
  } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).send('Internal Server Error');
  }
});

// 내 정보
router.get('/user', async (req, res) => {
  const { userid } = req.query;
  console.log(userid)

  try {
    // userid를 사용하여 해당 사용자의 정보를 찾음
    const result = await User.findOne({ where: { userid: userid } });

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ result });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;