import React from 'react';
import styled from 'styled-components';
import PostList from '../components/PostList';
import { useNavigate } from 'react-router-dom';
import data from '../data.json'
import accountdata from '../accountdata.json'

const Table = styled.table`
  border-collapse: collapse;
  width: 80%; 
  margin: 0 auto; 
  border: 1px solid #000000;
`;

const Tr = styled.tr`
  padding: 8px;
  ${({ wide }) => wide && 'width: 10%;'} /* 제목을 제외한 다른 열은 좁게 설정 */
`;

const Td = styled.td`
  border-bottom: 2px solid #000000;
  padding: 8px;
  ${({ wide }) => wide && 'width: 70%;'} /* 제목 열은 넓게 설정 */
`;


function PostTable(props){
  const { postwhat } = props;
  const user = accountdata;
  const navigate = useNavigate();
  let boardPosts = data.filter(post => post.board === postwhat);

  if(postwhat === 'mypost'){
    boardPosts = [{
      "id": 2,
      "board": "mypost",
      "author": "q",
      "title": "qqq",
      "content": "",
      "recommends": 4,
      "comments": [
          {
              "id": 21,
              "content": ""
          }            
      ],
    }]
  }

  return (
        <Table>
            <thead>
              <Tr>
                <Td></Td>
                <Td>작성자</Td>
                <Td wide>제목</Td>
                <Td>추천수</Td>
              </Tr>
            </thead>

              <PostList
                    posts = {boardPosts} // 필터링된 게시물 전달
                    onClickItem = {(item) =>{
                        navigate(`/post/${item.id}`);
                    }}
                />
        </Table>
  );
};

export default PostTable;