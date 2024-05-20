import React from 'react';
import styled from 'styled-components';
import PostList from '../components/PostList';
import { useNavigate } from 'react-router-dom';
import data from '../data.json'

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

const Thead = styled.thead`
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #dfe4e7;
  font-weight: 550;
`;


function PostTable(props){
  const { postwhat, currentPage, postsPerPage } = props;
  const navigate = useNavigate();
  let boardPosts = data.filter(post => post.board === postwhat);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = boardPosts.slice(indexOfFirstPost, indexOfLastPost);

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
            <Thead>
              <Tr>
                <Td></Td>
                <Td>작성자</Td>
                <Td wide>제목</Td>
                <Td>추천수</Td>
              </Tr>
            </Thead>

              <PostList
                    posts = {currentPosts} // 필터링된 게시물 전달
                    onClickItem = {(item) =>{
                        navigate(`/post/${item.id}`);
                    }}
                />
        </Table>
  );
};

export default PostTable;