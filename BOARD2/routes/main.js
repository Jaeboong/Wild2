const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";
const Post = require("../models/Post")
const asyncHandler = require("express-async-handler");
const { Op } = require('sequelize');

// 민원 게시판
router.get(
    ["/board/complain"],
    asyncHandler(async (req, res) => {
        const locals = {
            title: "Complain",
        };
        const data = await Post.findAll({
            attributes: ['title', 'content', 'userId', 'recommend', 'createdAt'],
            where: {
                category: 'complain'
            },
            order: [['createdAt', 'DESC']] 
        });
        res.render("board", { locals, data, layout: mainLayout });
    })
);

// 제보 게시판
router.get(
    ["/board/report"],
    asyncHandler(async (req, res) => {
        const locals = {
            title: "Report",
        };
        const data = await Post.findAll({
            attributes: ['title', 'content', 'userId', 'recommend', 'createdAt'],
            where: {
                category: 'report'
            },
            order: [['createdAt', 'DESC']] 
        });
        res.render("report", { locals, data, layout: mainLayout });
    })
);


// HOT 게시판
router.get(
    ["/board/hot"],
    asyncHandler(async (req, res) => {
        const locals = {
            title: "Hot",
        };
        const hotPosts = await Post.findAll({
            attributes: ['title', 'content', 'userId', 'recommend', 'createdAt'],
            where: {
                recommend: {
                    [Op.gte]: 10 // 추천수가 10 이상인 게시물만 가져옴
                }
            },
            order: [['createdAt', 'DESC']]
        });
        res.render("hot", { locals, hotPosts, layout: mainLayout });
    })
);



// 공지 게시판
router.get(
    ["/board/notice"],
    asyncHandler(async (req, res) => {
        const locals = {
            title: "Notice",
        };
        const data = await Post.findAll({
            attributes: ['title', 'content', 'userId', 'createdAt'],
            where: {
                category: 'notice'
            }
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
            attributes: ['title', 'content', 'userId', 'createdAt']
        });
        res.render("reports", { locals, data, layout: mainLayout });
    })
);


//내 게시글 보기(로그인 하고)
router.get(
    ["/board/mywrite"],
    asyncHandler(async (req, res) => {
        const locals = {
            title: "MyWrite",
        };
        const data = await Post.findAll({
            attributes: ['title', 'content', 'userId', 'recommend', 'createdAt']
        });
        res.render("mywrite", { locals, data, layout: mainLayout });
    })
)

router.get("/post", asyncHandler(async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: ['title', 'content', 'userId', 'recommend', 'createdAt']
        });
        res.render("post", { posts, layout: mainLayout });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Internal server error");
    }
}));



router.get("/post/:id", asyncHandler(async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        res.render("post", { post, layout: mainLayout });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).send("Internal server error");
    }
}));


// 검색 기능
router.get("/search", asyncHandler(async (req, res) => {
    // 클라이언트로부터 검색어를 받음
    const searchKeyword = req.query.query;

    // 검색어가 제공되지 않은 경우 기본 검색어 설정
    const keyword = searchKeyword || "기본 검색어";

    try {
        // 민원 게시판에서 검색
        const complainResults = await Post.findAll({ 
            where: { 
                [Op.and]: [
                    { 
                        [Op.or]: [
                            { title: { [Op.like]: `%${keyword}%` } },
                            { userId: { [Op.like]: `%${keyword}%` } }
                        ]
                    },
                    { category: 'complain' } // 민원 게시판에 대한 검색 결과 조건 추가
                ]
            },
            attributes: ['title', 'content', 'userId', 'recommend', 'createdAt']
        });

        // 제보 게시판에서 검색
        const reportResults = await Post.findAll({ 
            where: { 
                [Op.and]: [
                    { 
                        [Op.or]: [
                            { title: { [Op.like]: `%${keyword}%` } },
                            { userId: { [Op.like]: `%${keyword}%` } }
                        ]
                    },
                    { category: 'report' } // 제보 게시판에 대한 검색 결과 조건 추가
                ]
            },
            attributes: ['title', 'content', 'userId', 'recommend', 'createdAt']
        });

        // HOT 게시판에서 검색
        const hotResults = await Post.findAll({ 
            where: { 
                [Op.and]: [
                    { 
                        [Op.or]: [
                            { title: { [Op.like]: `%${keyword}%` } },
                            { userId: { [Op.like]: `%${keyword}%` } }
                        ]
                    },
                    { recommend: { [Op.gte]: 10 } } // 추천수가 10 이상인 게시물에 대한 검색 결과 조건 추가
                ]
            },
            attributes: ['title', 'content', 'userId', 'recommend', 'createdAt']
        });

        // 공지사항에서 검색
        const noticeResults = await Post.findAll({ 
            where: { 
                [Op.and]: [
                    { 
                        [Op.or]: [
                            { title: { [Op.like]: `%${keyword}%` } },
                            { userId: { [Op.like]: `%${keyword}%` } }
                        ]
                    },
                    { category: 'notice' } // 제보 게시판에 대한 검색 결과 조건 추가
                ]
            },
            attributes: ['title', 'content', 'userId', 'recommend', 'createdAt']
        });

        res.render('search-results', { 
            complainData: complainResults, 
            reportData: reportResults,
            hotData: hotResults,
            noticeData: noticeResults,
            layout: 'layouts/main' 
        });
    } catch (err) {
        console.error("Error searching posts:", err);
        res.status(500).send({ error: '검색 중 오류가 발생했습니다.' });
    }
}));







module.exports = router;