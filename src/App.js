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
import ProtectedRoute from './route/ProtectedRoute';
import PostEditPage from './pages/PostEditPage';
import MyRecommendPage from './pages/MyRecommendPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/complain" 
          element={
            <ProtectedRoute>
              <ComplainPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/report" 
          element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/hot" 
          element={
            <ProtectedRoute>
              <HotPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/announce" 
          element={
            <ProtectedRoute>
              <AnnouncementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/post-write" 
          element={
            <ProtectedRoute>
              <PostWritePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/post/:postId" 
          element={
            <ProtectedRoute>
              <PostViewPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-post/:postId"
          element={
            <ProtectedRoute>
              <PostEditPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/info" 
          element={
            <ProtectedRoute>
              <MyInfoPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mypost" 
          element={
            <ProtectedRoute>
              <MyPostPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/myrecommend" 
          element={
            <ProtectedRoute>
              <MyRecommendPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
