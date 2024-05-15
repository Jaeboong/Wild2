import React from 'react';
import styled from 'styled-components';

const Tr = styled.tr`
  padding: 8px;
  &:hover{
    background-color: lightgray;
  }
    cursor: pointer;
`;

const Td = styled.td`
  border: 1px solid #ccc;
  padding: 8px;
`;

function Post(props){
  const {post, onClick} = props;


  return (
        <Tr onClick={onClick}>
            <Td>{post.id}</Td>
            <Td>{post.author}</Td>
            <Td>{post.title}</Td>
            <Td>{post.recommends}</Td>
        </Tr>
  );
};

export default Post;