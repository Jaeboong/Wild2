import React from 'react';
import styled from 'styled-components';
import PostTable from '../components/PostTable';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header"

const Title = styled.div`
  display: flex;
  justify-content: center;
  font-size: 40px;
  padding: 20px;
  margin-top: 50px;
`;

const Wrapper = styled.div`
  padding: 10px;
  margin: 0 140px;
  display: flex;
  justify-content: space-between;
`;

function ReportPage(){
  const navigate = useNavigate();


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

        <PostTable postwhat='제보'/>
    </>
  );
};

export default ReportPage;