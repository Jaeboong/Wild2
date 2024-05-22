// main.js
const sequelize = require('./config/database');
const Post = require('./models/Post');

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // 게시글 생성
    const newPost = await Post.create({
      number: 1,
      author: '작성자1',
      title: '제목1',
      body: '내용 1 - 민원넣습니다.',
      recommendations: 19,
      createdAt: new Date('2024-05-19T00:00:00.000Z')
    });
    console.log('Post created:', newPost.toJSON());

    // 게시글 조회
    const post = await Post.findOne({ where: { number: 1 } });
    console.log('Post found:', post.toJSON());

    // 게시글 업데이트
    post.title = '제목1 - 수정됨';
    await post.save();
    console.log('Post updated:', post.toJSON());

    // 게시글 삭제
    await post.destroy();
    console.log('Post deleted');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

main();