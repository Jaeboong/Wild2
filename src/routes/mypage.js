const express = require("express");
const router = express.Router();
// const mainLayout = "../templates/layouts/main.ejs";
const mainLayout = "../views/layouts/main.ejs";

const { sequelize, User } = require('../index');  // Sequelize 인스턴스 및 모델 가져오기
// const asyncHandler = require('express-async-handler');

// mypage
router.get("/mypage", async (req, res) => {
    const locals = {
        title: "mypageInfo"
    }
    const users = await User.findOne({ where: { email : 'david@example.com' } });

    res.render("mypageInfo", {locals, users, layout: mainLayout});
});
// updateUser POST 요청 핸들러
router.post('/updateUser', async (req, res) => {
    const { name, email, password, phone } = req.body;

    console.log('Received data:', req.body);  // 디버그용 로그

    try {
        const result = await User.update( // 이메일은 수정 불가.
            { name, password, phone },
            { where: { email } }
        );
        console.log('Update result:', result);  // 업데이트 결과 로그

        if (result[0] > 0) {
            console.log('User updated successfully');
        } else {
            console.log('No rows updated');
        }

        res.redirect('/mypage');  // 업데이트 후 마이페이지로 리디렉션
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get("/mypageBoard", (req, res) => {
    const locals = {
        title: "mypageBoard"
    }
    res.render("mypageBoard", {locals, layout: mainLayout});
});

module.exports = router;