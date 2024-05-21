import React from 'react';
import styled from 'styled-components';
import PostTable from '../components/PostTable';
import Header from "../components/Header"
import Pagination from '../components/Pagination';
import { useState } from 'react';

const Title = styled.div`
  display: flex;
  justify-content: center;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 45px;
  font-weight: 500;
  padding: 20px;
  margin-top: 50px;
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
  margin-left: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
`;


function HotPage(){
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
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
      <Header/>
        <Title>HOT 게시판</Title>

        <Wrapper>
        <SearchWrapper>
          <input 
            placeholder='검색...' 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchWrapper>
      </Wrapper>

        <PostTable currentPage={currentPage} postsPerPage={postsPerPage} />

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </>
  );
};

export default HotPage;