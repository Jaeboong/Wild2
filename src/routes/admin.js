// const express = require("express");
// const router = express.Router();
// const adminLayout = "../views/layouts/admin";
// const adminLayout2 = "../views/layouts/admin-nologout";
// const asyncHandler = require("express-async-handler");
// const Post = require("../models/Post");
// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const jwtSecret = process.env.JWT_SECRET;

// // Check Login

// const checkLogin = (req, res, next) => {
//     const token = req.cookies.token;
//     if(!token){
//         res.redirect("/admin");
//     }
//     else{
//         try{
//             const decoded = jwt.verify(token, jwtSecret);
//             req.userId = decoded.userId;
//             next();
//         }catch(error){
//             res.redirect("/admin");
//         }
//     }
// }

// // Admin Page
// // Get /admin

// router.get("/admin", (req, res) =>{
//     const locals = {
//         title: "관리자 페이지",
//     };
//     res.render("admin/index", {locals, layout: adminLayout2});
// });

// router.post("/admin", asyncHandler(async(req, res) => {
//     const {username, password} = req.body;
//     const user = await User.findOne({username});
//     if(!user){
//         return res.status(401).json({message: "일치하는 사용자가 없습니다."});
//     }

//     const isValidPassword = await bcrypt.compare(password, user.password);

//     if (!isValidPassword){
//         return res.status(401).json({message: "비밀번호가 일치하지 않습니다."});
//     }

//     const token = jwt.sign({id: user._id}, jwtSecret);
//     res.cookie("token", token, {httpOnly: true});
//     res.redirect("/allPosts");
// }))

// router.get("/register", asyncHandler(async(req, res) =>{
//     res.render("admin/index", {layout: adminLayout2});
// }));

// router.post("/register", asyncHandler(async(req, res) =>{
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const user = await User.create({
//         username: req.body.username,
//         password: hashedPassword
//     })
    
// }));

// // Get all Posts

// router.get("/allPosts", checkLogin, asyncHandler(async(req, res)=>{
//     const data = await Post.find();
//     const locals = {
//         title: "Posts"
//     }
//     res.render("admin/allPosts", {locals, data, layout: adminLayout});
// }));

// router.get("/post/:id", checkLogin, asyncHandler(async (req, res) => {
//     const post = await Post.findById(req.params.id);
//     if (!post) {
//         return res.status(404).send("Post not found.");
//     }
//     res.render("admin/post_detail", { post, layout: adminLayout });
// }));

// // Admin logout
// // GET /logout

// router.get("/logout", (req, res)=>{
//     res.clearCookie("token");
//     res.redirect("/");
// })

// // Admin - add post
// // GET /add

// router.get("/add", checkLogin, asyncHandler(async(req, res) => {
//     const locals = {
//         title: "게시물 작성"
//     }
//     res.render("admin/add", {locals, layout: adminLayout});
// }))

// // admin - add post
// // POST /add

// router.post("/add", checkLogin, asyncHandler(async(req, res) => {
//     const {title, body} = req.body;
//     const newPost = new Post({
//         title: title,
//         body: body
//     })

//     await Post.create(newPost);
//     res.redirect("/allPosts");
// }))

// /*
// * Admin - Edit Post
// * GET /edit/:id
// */

// router.get("/edit/:id", checkLogin, asyncHandler(async(req, res) => {
//     const locals = {title: "게시물 편집"};
//     const data = await Post.findOne({_id: req.params.id});
//     res.render("admin/edit", {locals, data, layout: adminLayout});
// }))

// /*
// * Admin - Edit Post
// * PUT /edit/:id
// */

// router.put("/edit/:id", checkLogin, asyncHandler(async(req, res) => {
//     await Post.findByIdAndUpdate(req.params.id, {
//         title: req.body.title,
//         body: req.body.body,
//         createAt: Date.now()
//     })
//     res.redirect("/allPosts");
// }))

// /*
// * Admin - Delete Post
// * DELETE /delete/:id
// */

// router.delete("/delete/:id", checkLogin, asyncHandler(async(req, res) =>{
//     await Post.deleteOne({_id: req.params.id});
//     res.redirect("/allPosts");
// }))

// module.exports = router;