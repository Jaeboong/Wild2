// const express = require("express");
// const router = express.Router();
// const mainLayout = "../views/layouts/main.ejs";
// const Post = require("../models/Post");
// const asyncHandler = require("express-async-handler");

// router.get(["/", "/home"],
//  asyncHandler (async(req, res) => {
//     const locals = {
//         title: "Home"
//     }
//     const data = await Post.find();
//     res.render("index", {locals, data, layout: mainLayout});
// }))

// router.get("/about", (req, res) => {
//     const locals = {
//         title: "About"
//     }
//     res.render("about", {locals, layout: mainLayout});
//  })

// module.exports = router;

// // GET /post/:id
// // 게시물 상세 보기

// router.get(
//     "/post/:id",
//     asyncHandler(async (req, res) =>{
//         const data = await Post.findOne({_id: req.params.id});
//         res.render("post", {data, layout: mainLayout});
//     })
// );

// /*
// Post.insertMany([
//     {
//         title: "Title1",
//         body: "내용 1 - 123123123" 
//     },

//     {
//         title: "Title2",
//         body: "내용 2 - 123123123" 
//     },

//     {
//         title: "Title3",
//         body: "내용 3 - 123123123" 
//     },

//     {
//         title: "Title4",
//         body: "내용 4 - 123123123" 
//     }
// ])
// */