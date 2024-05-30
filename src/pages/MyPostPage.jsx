import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PostTable from '../components/PostTable';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import axios from 'axios';

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 10vh;
  background-color: rgb(140,3,39);
  padding: 40px;
`;

const Title = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 45px;
  font-weight: 550;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #ffffff;
`;

const Line = styled.div`
  width: 100%;
  text-align: center;
  border-bottom: 2px solid #D6CDBE;
  line-height: 0.2em;
  margin: 15px 0 15px;
`;

const Wrapper = styled.div`
  padding: 10px;
  display: flex;
  width: 80%; 
  margin: auto;
  justify-content: flex-end;
`;

const SearchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const SearchButton = styled.button`
font-size: 18px;
  margin-left: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #8C0327;
  color: #fff;
  cursor: pointer;
`;

function MyPostPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [clickSearch, setClickSearch] = useState(false);

  const token = localStorage.getItem('token');
  const payload = token.split('.')[1];
  const dec = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload), (c) => c.charCodeAt(0))));

  const postsPerPage = 10;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchPosts = async (keyword = '', board = 'mypost', page = 1) => {
    try {
      const endpoint = keyword ? 'search' : 'mypost';
      const response = await axios.get(`http://localhost:3001/board/${endpoint}`, {
        params: {
          query: keyword,
          page: page,
          userid: dec.id
        }
      });
      
      setPosts(response.data.posts);
      setTotalPosts(response.data.total);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts(searchKeyword, 'mypost', currentPage);
  }, [currentPage, clickSearch]);

  const handleSearch = () => {
    setCurrentPage(1);
    setClickSearch(true);
    fetchPosts(searchKeyword, 'mypost', 1);
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <>
      <Header />
      <TitleContainer>
        <Line />
          <Title>내가쓴 글</Title>
        <Line />
      </TitleContainer>
      <Wrapper>
        <SearchWrapper>
          <input
            placeholder="검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchWrapper>
      </Wrapper>
      <PostTable postwhat={posts} currentPage={currentPage} postsPerPage={postsPerPage} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  );
}

export default MyPostPage;