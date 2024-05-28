import React, { useState } from 'react';
import styled from 'styled-components';
import PostTable from '../components/PostTable';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Pagination from '../components/Pagination';

const Title = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 45px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  padding: 20px;
  margin-top: 50px;
`;

const Wrapper = styled.div`
  padding: 10px;
  width: 80%;
  display: flex;
  margin: auto;
  justify-content: space-between;
`;

const SearchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SearchButton = styled.button`
  margin-left: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
`;

function ComplainPage(){
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/search', {
        params: {
          query: searchKeyword,
          page: currentPage,
          limit: postsPerPage
        }
      });
      setPosts(response.data.posts);
      setTotalPosts(response.data.total);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const totalPages = 10;

  return (
    <>
      <Header />
      <Title>민원 게시판</Title>
      <Wrapper>
        <Button 
          title="글 작성" 
          onClick={() => {
            navigate("/post-write");
          }}
        />
        <SearchWrapper>
          <input placeholder='검색...' />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchWrapper>
      </Wrapper>
      <PostTable postwhat='민원' currentPage={currentPage} postsPerPage={postsPerPage} />
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </>
  );
};

export default ComplainPage;