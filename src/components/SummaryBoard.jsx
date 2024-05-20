import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import data from '../data.json';

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

const Title = styled(NavLink)`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-weight: 550;
  margin-bottom: 10px;
  text-decoration: none;
  color: #000;
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
  font-family: 'Noto Sans KR', sans-serif;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

function SummaryBoard(props) {
  const {postwhat} = props;
  const top3Posts = data.filter(post => post.board === postwhat)
                        .sort((a, b) => b.id - a.id)
                        .slice(0, 4);

  const boardLink = postwhat === '공지' ? '/announce' : '/complain';
  const boardTitle = postwhat === '공지' ? '공지사항' : '민원 게시판';

  return (
    <BoardBox>
      <Title to={boardLink}> {boardTitle + ' +'} </Title>
      {top3Posts.map(post => (
        <BoardLink key={post.id} to={`/post/${post.id}`}>{post.title}</BoardLink>
      ))}
    </BoardBox>
  );
};

export default SummaryBoard;