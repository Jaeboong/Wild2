import './App.css';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ComplainPage from './pages/ComplainPage';
import PostViewPage from './pages/PostViewPage';
import PostWritePage from './pages/PostWritePage';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="signup" element={<SignUpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="complain" element={<ComplainPage />} />
        <Route path="post-write" element={<PostWritePage />} />
        <Route path="post/:postId" element={<PostViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
