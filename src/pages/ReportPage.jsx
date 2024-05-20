import React from 'react';
import styled from 'styled-components';
import PostTable from '../components/PostTable';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
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
  width: 80%;
  display: flex;
  margin: auto;
  justify-content: space-between;
`;

function ReportPage(){
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = 10;

  return (
    <>
      <Header/>
        <Title>제보 게시판</Title>
        <Wrapper>
          <Button 
            title="글 작성" 
            onClick={() => {
              navigate("/post-write");
            }}
          />
          <input placeholder='검색...'/>
        </Wrapper>
        <PostTable postwhat='제보' currentPage={currentPage} postsPerPage={postsPerPage} />
        <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
        />  
    </>
  );
};

export default ReportPage;