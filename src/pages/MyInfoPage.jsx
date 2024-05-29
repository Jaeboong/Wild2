import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import Header from "../components/Header"
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const LeftBottom = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  flex: 0 0 15%;
  height: 100vh;
  background-color: rgba(137, 7, 0, 0.3);
`;

const RightBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  background-color: rgba(255, 180, 180, 0.2);
`;

const Linkto = styled(NavLink)`
  display: flex;
  margin-right: 20px;
  margin-left: 15px;
  margin: 30px;
  text-decoration: none;
  padding-top: 5px;
  font-size: 20px;
  color: black;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 40px;
`;

const Input = styled.input`
  margin-bottom: 50px;
  padding: 5px;
  height: 30px;
  width: 45%;
  font-size: 30px;
`;

const Button = styled.button`
  padding: 5px 10px;
  border: none;
  background-color: #8C0327;
  color: white;
  cursor: pointer;
  margin-top: 10px;
`;

const Line = styled.div`
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #2d2d2d;
  line-height: 0.1em;
  margin: 10px 0 20px;
`;

function MyInfoPage() {
  const token = localStorage.getItem('token');
  const payload = token.split('.')[1];
  const dec = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload), (c) => c.charCodeAt(0))));

  const [nickname, setNickname] = useState(dec.username);
  const [id, setId] = useState(dec.id);
  const [pw, setPw] = useState();
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put('http://localhost:3001/updateUser', {
        username: nickname !== dec.username ? nickname : dec.username,
        id: id !== dec.id ? id : dec.id,
        pw: pw,
      });
      if (response.status === 200) {
        alert('정보가 성공적으로 수정되었습니다.');
        setEditMode(false); 
      }
    } catch (error) {
      console.error('Error updating user information:', error);
      alert('아이디는 바꿀 수 없습니다.');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말 탈퇴하시겠습니까?');
    if (confirmDelete) {
      try {
        const response = await axios.delete('http://localhost:3001/user', {
          data: { id: dec.id }
        });
        if (response.status === 200) {
          alert('회원 탈퇴가 성공적으로 처리되었습니다.');
          localStorage.removeItem('token');
          navigate('/'); 
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('회원 탈퇴에 실패했습니다.');
      }
    }
  };

  return (
    <>
      <Header />
      <Container>
        <LeftBottom>
          <h2>User Profile</h2>
          <Linkto to="#" onClick={() => setEditMode(false)}>● 내 정보</Linkto>
          <Linkto to="#" onClick={() => setEditMode(true)}>● 개인 정보 수정</Linkto>
          <Linkto to="/mypost">● 내가쓴 글</Linkto>
          <Linkto to="/myrecommend">● 추천한 글</Linkto>
          <Linkto to="#" onClick={handleDelete}>● 회원 탈퇴</Linkto>

          {dec.isAdmin &&
          <>
            <Line/>
            <Linkto to="/ban">● 신고글 목록</Linkto>
          </>
          }
        </LeftBottom>
        <RightBottom>
          {editMode ? (
            <Form onSubmit={handleUpdate}>
              <label>
                닉네임:
                <Input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </label>
              <label>
                아이디:
                <Input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </label>
              <label>
                패스워드:
                <Input
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                />
              </label>
              <Button type="submit">정보 수정</Button>
              <Button type="button" onClick={() => setEditMode(false)}>취소</Button>
            </Form>
          ) : (
            <>
              <h1>사용자 정보</h1>
              <h1>닉네임 : {dec.username}</h1>
              <h1>아이디 : {dec.id}</h1>
            </>
          )}
        </RightBottom>
      </Container>
    </>
  );
}

export default MyInfoPage;