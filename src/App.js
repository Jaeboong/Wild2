import './App.css';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ComplainPage from './pages/ComplainPage';
import PostViewPage from './pages/PostViewPage';
import PostWritePage from './pages/PostWritePage';
import ReportPage from './pages/ReportPage';
import HotPage from './pages/HotPage';
import MyInfoPage from './pages/MyInfoPage';
import AnnouncementPage from './pages/AnnouncementPage';
import MyPostPage from './pages/MyPostPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="complain" element={<ComplainPage />} />
        <Route path="report" element={<ReportPage />} />
        <Route path="hot" element={<HotPage />} />
        <Route path="announce" element={<AnnouncementPage />} />
        <Route path="post-write" element={<PostWritePage />} />
        <Route path="post/:postId" element={<PostViewPage />} />
        <Route path="info" element={<MyInfoPage />} />
        <Route path="mypost" element={<MyPostPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
