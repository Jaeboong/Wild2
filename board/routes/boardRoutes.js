const express = require("express");
const router = express.Router();

// 게시글 목록 데이터 예시
const boards = [
    { id: 1, author: '사용자1', title: '첫 번째 게시글', views: 100 }
];

// 게시글 목록을 보여주기
router.get("/", (req, res) => {
    res.render("boards", { boards: boards });
});

module.exports = router;
