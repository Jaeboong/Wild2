require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const asyncHandler = require('express-async-handler');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt'); 
const { sequelize, User, Post, Comment } = require('./src/index');  // Sequelize 인스턴스 및 모델 가져오기

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

const boardRoutes = require('./src/routes/boardRoutes');
app.use('/', asyncHandler(boardRoutes));

app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: true });  // 데이터베이스 동기화 (force: true로 설정하여 기존 테이블을 삭제하고 다시 생성)
    console.log('Database synchronized');

    
    const adminPassword = await bcrypt.hash('qwer1234', 10);
    await User.bulkCreate([
      { userid: 'admin',
      username: 'admin', 
      email: 'admin@korea.ac.kr',
      phoneNumber: 'adminNumber',
      password: adminPassword,
      isAdmin: true },
    
      { userid: 'gdae',
      username: '고대의빛', 
      email: 'gdae@example.com',
      phoneNumber: '010-9876-5432',
      password: await bcrypt.hash('Password1!', 10),
      isAdmin: false },
    
      { userid: 'wisdom',
      username: '응애나지혜', 
      email: 'wisdom@example.com',
      phoneNumber: '010-1234-5678',
      password: await bcrypt.hash('Password2!', 10),
      isAdmin: false },
    
      { userid: 'brave',
      username: '용맹한고대인', 
      email: 'brave@example.com',
      phoneNumber: '010-2345-6789',
      password: await bcrypt.hash('Password3!', 10),
      isAdmin: false },
    
      { userid: 'justice',
      username: '정의관통', 
      email: 'justice@example.com',
      phoneNumber: '010-3456-7890',
      password: await bcrypt.hash('Password4!', 10),
      isAdmin: false },
    
      { userid: 'tiger',
      username: '호랑이의힘', 
      email: 'tiger@example.com',
      phoneNumber: '010-4567-8901',
      password: await bcrypt.hash('Password5!', 10),
      isAdmin: false },
    
      { userid: 'blade',
      username: '데마시아를위하여', 
      email: 'blade@example.com',
      phoneNumber: '010-5678-9012',
      password: await bcrypt.hash('Password6!', 10),
      isAdmin: false },
    
      { userid: 'truth',
      username: '진리관 통(남자)', 
      email: 'truth@example.com',
      phoneNumber: '010-6789-0123',
      password: await bcrypt.hash('Password7!', 10),
      isAdmin: false },
    
      { userid: 'hero',
      username: '지야의함성', 
      email: 'hero@example.com',
      phoneNumber: '010-7890-1234',
      password: await bcrypt.hash('Password8!', 10),
      isAdmin: false },
    
      { userid: 'future',
      username: '미래관 통(남자)', 
      email: 'future@example.com',
      phoneNumber: '010-8901-2345',
      password: await bcrypt.hash('Password9!', 10),
      isAdmin: false },
    
      { userid: 'dreamer',
      username: '자유인', 
      email: 'dreamer@example.com',
      phoneNumber: '010-9012-3456',
      password: await bcrypt.hash('Password10!', 10),
      isAdmin: false },
    
      { userid: 'light',
      username: '진리관 통(여자)', 
      email: 'light@example.com',
      phoneNumber: '010-0123-4567',
      password: await bcrypt.hash('Password11!', 10),
      isAdmin: false },
    
      { userid: 'innovate',
      username: '미래관 통(여자)', 
      email: 'innovate@example.com',
      phoneNumber: '010-1234-5679',
      password: await bcrypt.hash('Password12!', 10),
      isAdmin: false },
    
      { userid: 'heroic',
      username: '고려대 등대지기', 
      email: 'heroic@example.com',
      phoneNumber: '010-2345-6780',
      password: await bcrypt.hash('Password13!', 10),
      isAdmin: false },
    
      { userid: 'warrior',
      username: 'KuKUKU', 
      email: 'warrior@example.com',
      phoneNumber: '010-3456-7891',
      password: await bcrypt.hash('Password14!', 10),
      isAdmin: false },
    
      { userid: 'pioneer',
      username: '미래의개척자', 
      email: 'pioneer@example.com',
      phoneNumber: '010-4567-8902',
      password: await bcrypt.hash('Password15!', 10),
      isAdmin: false },
    
      { userid: 'wings',
      username: '자유의날개', 
      email: 'wings@example.com',
      phoneNumber: '010-5678-9013',
      password: await bcrypt.hash('Password16!', 10),
      isAdmin: false },
    
      { userid: 'guide',
      username: '미래의길잡이', 
      email: 'guide@example.com',
      phoneNumber: '010-6789-0124',
      password: await bcrypt.hash('Password17!', 10),
      isAdmin: false },
    
      { userid: 'spirit',
      username: '자유의혼', 
      email: 'spirit@example.com',
      phoneNumber: '010-7890-1235',
      password: await bcrypt.hash('Password18!', 10),
      isAdmin: false },
    
      { userid: 'passion',
      username: '열정고대인', 
      email: 'passion@example.com',
      phoneNumber: '010-8901-2346',
      password: await bcrypt.hash('Password19!', 10),
      isAdmin: false },
    
      { userid: 'soul',
      username: '민원좀넣을게', 
      email: 'soul@example.com',
      phoneNumber: '010-9012-3457',
      password: await bcrypt.hash('Password20!', 10),
      isAdmin: false },
    
      { userid: 'knowledge',
      username: '배고프다', 
      email: 'knowledge@example.com',
      phoneNumber: '010-0123-4568',
      password: await bcrypt.hash('Password21!', 10),
      isAdmin: false },
    
      { userid: 'shield',
      username: '정의의방패', 
      email: 'shield@example.com',
      phoneNumber: '010-1234-5670',
      password: await bcrypt.hash('Password22!', 10),
      isAdmin: false },
    
      { userid: 'seeker',
      username: '학식킬러', 
      email: 'seeker@example.com',
      phoneNumber: '010-2345-6781',
      password: await bcrypt.hash('Password23!', 10),
      isAdmin: false },
    
      { userid: 'phoenix',
      username: '휴대용대장간', 
      email: 'phoenix@example.com',
      phoneNumber: '010-3456-7892',
      password: await bcrypt.hash('Password24!', 10),
      isAdmin: false },
    
      { userid: 'passionfire',
      username: '삼위일체', 
      email: 'passionfire@example.com',
      phoneNumber: '010-4567-8903',
      password: await bcrypt.hash('Password25!', 10),
      isAdmin: false },
    
      { userid: 'creative',
      username: '필 포든', 
      email: 'creative@example.com',
      phoneNumber: '010-5678-9014',
      password: await bcrypt.hash('Password26!', 10),
      isAdmin: false },
    
      { userid: 'spiritofku',
      username: '다비드 트레제게', 
      email: 'spiritofku@example.com',
      phoneNumber: '010-6789-0125',
      password: await bcrypt.hash('Password27!', 10),
      isAdmin: false },
    
      { userid: 'passionate',
      username: '열정학도', 
      email: 'passionate@example.com',
      phoneNumber: '010-7890-1236',
      password: await bcrypt.hash('Password28!', 10),
      isAdmin: false },
    
      { userid: 'intellect',
      username: 'im 지성인', 
      email: 'intellect@example.com',
      phoneNumber: '010-8901-2347',
      password: await bcrypt.hash('Password29!', 10),
      isAdmin: false },
    
      { userid: 'knowledgepursuer',
      username: '호동생', 
      email: 'knowledgepursuer@example.com',
      phoneNumber: '010-9012-3458',
      password: await bcrypt.hash('Password30!', 10),
      isAdmin: false },
    
    ]);
    const announcements = [
      {
        postid: 1,
        userid: 'admin',
        title: "민원 처리 절차 안내",
        content: `
안녕하세요, 학생 여러분.
민원 처리 절차에 대해 안내드립니다. 민원 신청은 학교 홈페이지 또는 민원 게시판을 통해 가능합니다. 접수된 민원은 최대 7일 이내에 처리됩니다. 자세한 절차는 아래와 같습니다:

1. 민원 접수: 홈페이지 또는 게시판을 통해 신청
2. 민원 확인: 담당자가 내용을 확인하고, 필요한 경우 추가 자료 요청
3. 민원 처리: 관련 부서와 협의하여 문제 해결
4. 처리 결과 통보: 게시글 댓글을 통해 해결

학생 여러분의 소중한 의견을 반영하여 더 나은 학교 생활을 만들어가겠습니다.
감사합니다.
        `,
        category: 'announce',
        date: new Date()
      },
      {
        postid: 2,
        userid: 'admin',
        title: "민원 게시판 이용 규칙 안내",
        content: `
안녕하세요, 학생 여러분.
민원 게시판 이용 시 지켜야 할 규칙에 대해 안내드립니다. 아래 규칙을 준수하여 쾌적한 게시판 환경을 유지해 주세요:

1. 민원 내용은 구체적이고 명확하게 작성해 주세요.
2. 개인 정보(전화번호, 이메일 등)는 작성하지 마세요.
3. 욕설, 비방, 허위 사실 유포 등 부적절한 내용은 금지됩니다.
4. 동일한 민원을 반복해서 작성하지 마세요.
5. 민원 접수 후 처리 결과는 게시판 댓글을 통해 확인해 주세요.

위 규칙을 어길 시 게시물 삭제 및 이용 제한 조치가 있을 수 있습니다.
감사합니다.
        `,
        category: 'announce',
        date: new Date()
      },
      {
        postid: 3,
        userid: 'admin',
        title: "민원 처리 현황 공개 안내",
        content: `
안녕하세요, 학생 여러분.
최근 접수된 민원의 처리 현황을 공개합니다. 학교는 모든 민원을 신속하고 공정하게 처리하고 있으며, 현재 진행 상황은 다음과 같습니다:

- 학내 시설 개선 요청: 처리 중 (예정 완료일: 2024-06-30)
- 교내 식당 메뉴 개선 요청: 완료 (결과 확인 가능)
- 기숙사 인터넷 속도 개선 요청: 처리 중 (예정 완료일: 2024-05-15)

앞으로도 투명한 민원 처리를 위해 최선을 다하겠습니다. 민원 처리에 대한 문의는 게시판을 통해 접수해 주세요.
감사합니다.
        `,
        category: 'announce',
        date: new Date()
      },
      {
        postid: 4,
        userid: 'admin',
        title: "민원 처리 결과 피드백 요청",
        content: `
안녕하세요, 학생 여러분.
민원 처리 결과에 대한 여러분의 소중한 피드백을 기다립니다. 민원 처리 결과에 대해 만족스러운 점이나 개선이 필요한 점이 있다면 게시판을 통해 알려주세요. 여러분의 피드백은 향후 민원 처리 절차 개선에 큰 도움이 됩니다.

피드백 작성 시 유의 사항:
- 구체적인 개선 사항이나 칭찬할 점을 적어주세요.
- 처리 결과에 대한 상세한 설명을 포함해 주세요.

여러분의 적극적인 참여를 부탁드립니다.
감사합니다.
        `,
        category: 'announce',
        date: new Date()
      },
      {
        postid: 5,
        userid: 'gdae',
        title: "교내 Wi-Fi 개선 요청",
        content: "안녕하세요, 교내 Wi-Fi가 자주 끊기고 속도가 느려 학습에 불편함을 겪고 있습니다. 빠른 개선 부탁드립니다.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 6,
        userid: 'wisdom',
        title: "식당 음식의 위생 문제",
        content: "교내 식당에서 제공되는 음식의 위생 상태가 좋지 않아 건강에 문제가 생길 수 있습니다. 철저한 관리와 개선이 필요합니다.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 7,
        userid: 'brave',
        title: "기숙사 냉난방 문제",
        content: "기숙사 냉난방 시스템이 제대로 작동하지 않아 생활에 큰 불편을 겪고 있습니다. 시급한 수리가 필요합니다.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 8,
        userid: 'justice',
        title: "강의실 청결 유지 요청",
        content: "강의실 청결 상태가 좋지 않아 쾌적한 학습 환경 조성이 어렵습니다. 정기적인 청소와 관리가 필요합니다.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 9,
        userid: 'tiger',
        title: "교내 주차 공간 부족",
        content: "교내 주차 공간이 부족하여 많은 학생들이 불편을 겪고 있습니다. 추가 주차 공간 마련을 요청드립니다.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 10,
        userid: 'blade',
        title: "교내 보안 강화 요청",
        content: "최근 교내에서 발생한 여러 사건들로 인해 학생들의 불안감이 높아지고 있습니다. 교내 보안 강화를 요청드립니다.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 11,
        userid: 'truth',
        title: "도서관 시설 개선 요청",
        content: "도서관 시설이 낡아 이용에 불편을 겪고 있습니다. 시설 개선과 업데이트가 필요합니다.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 12,
        userid: 'hero',
        title: "교내 자전거 도난 문제",
        content: "최근 교내에서 자전거 도난 사건이 빈번하게 발생하고 있습니다. 도난 방지를 위한 대책 마련을 요청드립니다.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 13,
        userid: 'future',
        title: "수업 시간 조정 요청",
        content: "현재 수업 시간표가 너무 빡빡하여 학습과 생활의 균형을 맞추기 어렵습니다. 수업 시간 조정을 요청드립니다.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 14,
        userid: 'dreamer',
        title: "교내 소음 문제",
        content: "교내 건물 공사로 인해 소음이 심하여 학습에 큰 지장이 있습니다. 소음 문제 해결을 요청드립니다.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 15,
        userid: 'light',
        title: "교내 식수대 개선 요청",
        content: "교내 식수대의 물이 깨끗하지 않아 마시기 꺼려집니다. 식수대 개선을 요청드립니다.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 16,
        userid: 'innovate',
        title: "학생회관 내 시설 보수 요청",
        content: "학생회관 내 일부 시설이 낡아 이용에 불편을 겪고 있습니다. 보수가 필요합니다.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 17,
        userid: 'heroic',
        title: "교내 전등 교체 요청",
        content: "교내 건물 내 전등이 고장나 어두운 곳이 많습니다. 전등 교체를 요청드립니다.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 18,
        userid: 'warrior',
        title: "체육관 시설 개선 요청",
        content: "체육관 시설이 낡고 부족하여 운동에 불편함을 겪고 있습니다. 시설 개선을 요청드립니다.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 19,
        userid: 'pioneer',
        title: "교내 셔틀버스 시간표 변경 요청",
        content: "교내 셔틀버스 시간표가 불편하여 많은 학생들이 이용에 어려움을 겪고 있습니다. 시간표 변경을 요청드립니다.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 20,
        userid: 'wings',
        title: "기숙사 내 소음 문제",
        content: "기숙사 내 소음이 심하여 잠을 자거나 공부를 하는 데 지장이 있습니다. 소음 문제 해결을 요청드립니다.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 21,
        userid: 'guide',
        title: "교내 쓰레기 처리 문제",
        content: "교내 곳곳에 쓰레기가 많이 버려져 있어 불쾌합니다. 쓰레기 처리 문제를 해결해 주세요.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 22,
        userid: 'spirit',
        title: "강의실 냉난방 문제",
        content: "강의실 냉난방 시스템이 제대로 작동하지 않아 수업에 지장을 주고 있습니다. 빠른 해결을 요청드립니다.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 23,
        userid: 'passion',
        title: "교내 행사 소음 문제",
        content: "교내 행사로 인해 소음이 심하여 학습에 지장을 받고 있습니다. 소음 문제를 해결해 주세요.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 24,
        userid: 'soul',
        title: "교내 인터넷 속도 문제",
        content: "교내 인터넷 속도가 너무 느려 학습과 연구에 큰 불편을 겪고 있습니다. 인터넷 속도 개선을 요청드립니다.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 25,
        userid: 'knowledge',
        title: "교내 식당 메뉴 개선 요청",
        content: "교내 식당 메뉴가 다양하지 않아 많은 학생들이 불편을 겪고 있습니다. 메뉴 개선을 요청드립니다.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 26,
        userid: 'shield',
        title: "교내 안전 관리 강화 요청",
        content: "교내 안전 관리가 소홀하여 사고 위험이 있습니다. 안전 관리 강화를 요청드립니다.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 27,
        userid: 'seeker',
        title: "도서관 자료 보충 요청",
        content: "도서관에 필요한 자료가 부족하여 학습에 지장을 주고 있습니다. 자료 보충을 요청드립니다.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 28,
        userid: 'phoenix',
        title: "교내 공기 질 개선 요청",
        content: "교내 공기 질이 좋지 않아 건강에 영향을 미칠 수 있습니다. 공기 질 개선을 요청드립니다.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 29,
        userid: 'passionfire',
        title: "기숙사 시설 보수 요청",
        content: "기숙사 시설이 낡아 이용에 불편을 겪고 있습니다. 시설 보수를 요청드립니다.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 30,
        userid: 'creative',
        title: "교내 예술 활동 지원 요청",
        content: "교내 예술 활동에 대한 지원이 부족합니다. 예술 활동 지원을 요청드립니다.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 31,
        userid: 'spiritofku',
        title: "교내 헬스장 시설 개선 요청",
        content: "교내 헬스장 시설이 낡고 부족하여 운동에 불편함을 겪고 있습니다. 시설 개선을 요청드립니다.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 32,
        userid: 'passionate',
        title: "교내 체육 대회 문제",
        content: "교내 체육 대회 진행 중 여러 문제가 발생하고 있습니다. 대회 운영 방식을 개선해 주세요.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 33,
        userid: 'intellect',
        title: "교내 전자기기 충전 문제",
        content: "교내 전자기기 충전 시설이 부족하여 불편을 겪고 있습니다. 충전 시설을 보충해 주세요.",
        category: 'complain',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      },
      {
        postid: 34,
        userid: 'knowledgepursuer',
        title: "기숙사 내 화재 경보 문제",
        content: "기숙사 내 화재 경보가 자주 울려 불안합니다. 화재 경보 시스템을 점검해 주세요.",
        category: 'report',
        recommend: Math.floor(Math.random() * 13),
        date: new Date()
      }
    ];

    await Post.bulkCreate(announcements);
    console.log('Announcements added');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  
}

initializeApp();



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
