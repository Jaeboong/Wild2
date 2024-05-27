import React from 'react';
import styled from 'styled-components';
import PostList from '../components/PostList';
import { useNavigate } from 'react-router-dom';

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
  background-color: #e7dfe3;
  font-weight: 550;
`;


function PostTable(props){
  const { postwhat, currentPage, postsPerPage } = props;
  const navigate = useNavigate();

  // let boardPosts = data.filter(post => post.board === postwhat);
  // boardPosts.reverse();

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // const currentPosts = boardPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
        <Table>
            <Thead>
              <Tr>
                <Td></Td>
                <Td>작성자</Td>
                <Td wide>제목</Td>
                <Td>추천수</Td>
                <Td>작성일</Td>
              </Tr>
            </Thead>

              {postwhat && <PostList
                    posts = {postwhat}
                    onClickItem = {(item) => {
                        navigate(`/post/${item.postid}`);
                    }}
                />
                  }
        </Table>
  );
};

export default PostTable;