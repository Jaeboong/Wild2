import React from 'react';
import styled from 'styled-components';

const Tr = styled.tr`
  font-family: 'Noto Sans KR', sans-serif;
  padding: 8px;
  &:hover{
    background-color: lightgray;
  }
    cursor: pointer;
`;

const Td = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
  font-family: 'Noto Sans KR', sans-serif;
`;

function Post(props){
  const {post, onClick} = props;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
        <Tr onClick={onClick}>
            <Td>{post.postid}</Td>
            <Td>{post.userid}</Td>
            <Td>{post.title}</Td>
            <Td>{post.recommend}</Td>
            <Td>{formatDate(post.date)}</Td>
        </Tr>
  );
};

export default Post;