import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const BoardBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 60px;
  position: relative;
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const BoardLink = styled(NavLink)`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #333;
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

function SummaryBoard() {
  return (
    <BoardBox>
      <Title>민원 게시판</Title>
      <BoardLink to="/">첫 번째 게시물</BoardLink>
      <BoardLink to="/">두 번째 게시물</BoardLink>
      <BoardLink to="/">세 번째 게시물</BoardLink>
    </BoardBox>
  );
};

export default SummaryBoard;