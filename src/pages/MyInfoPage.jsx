import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import Header from "../components/Header"
import axios from 'axios';

import { FaThumbsUp } from "react-icons/fa6";
import { BsPersonCircle } from "react-icons/bs"; // 정보
import { TiPencil } from "react-icons/ti"; // 수정
import { SlNotebook } from "react-icons/sl"; //내가쓴글 
import { PiSirenFill } from "react-icons/pi"; // 신고

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const LeftBottom = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 28%;
  height: 100vh;
  background-color: #8C0327;
  color: white;
  font-size: 30px;
`;

const RightBottom = styled.div`
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: rgba(255, 180, 180, 0.2);
`;

const HoverOption = styled.div`
  &:hover {
    background-color: #4d0116;
  }
  &.active {
    background-color: #510016;
  }
`;

const Linkto = styled(NavLink)`
  display: flex;
  margin-right: 20px;
  margin-left: 15px;
  margin: 30px;
  text-decoration: none;
  padding-top: 5px;
  font-size: 25px;
  color: white;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  font-size: 40px;
`;

const Input = styled.input`
  padding: 5px;
  height: 40px;
  width: 45%;
  font-size: 30px;
  color: #504848;
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
  border-bottom: 1px solid white;
  line-height: 0.1em;
  margin: 10px 0 20px;
`;

const InfoLine = styled.div`
  width: 100%;
  text-align: center;
  border-bottom: 3px solid #baa8a8;
  line-height: 0.1em;
  margin: 10px 0 20px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 200px;
  font-size: 40px;
  color: #504848;
`;

const Label = styled.label`
  display: flex;
  padding: 30px;
`;

const InfoTitle = styled.div`
  display:flex;
  margin-left: 200px;
  font-size: 50px;
  font-weight: 550;
  color: #504848;
`;

const VLine = styled.div`
  border-left : thick solid #9e8f8f;
  height : 50px;
`;

function MyInfoPage() {
  const token = localStorage.getItem('token');
  const payload = token.split('.')[1];
  const dec = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload), (c) => c.charCodeAt(0))));

  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user', {
          params: {
            userid: dec.id, 
          },
        });
        
        if (response.data.result) {
          setUsername(response.data.result.username);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
        alert('아이디는 바꿀 수 없습니다.');
      }
    };

    loadInfo();
  }, [dec.id]);

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put('http://localhost:3001/updateUser', {
        userid : dec.id,
        username: username !== dec.username ? username : dec.username,
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
          <h2 style={{display:"flex", justifyContent:"center"}}>User Profile</h2>

          <HoverOption>
            <Linkto to="#" onClick={() => setEditMode(false)}><BsPersonCircle />&nbsp; 내 정보</Linkto>
          </HoverOption>
          <HoverOption>
            <Linkto to="#" onClick={() => setEditMode(true)}><TiPencil />&nbsp;개인 정보 수정</Linkto>
          </HoverOption>
          <HoverOption>
            <Linkto to="/mypost"><SlNotebook />&nbsp;내가쓴 글</Linkto>
          </HoverOption>
          <HoverOption>
            <Linkto to="/myrecommend"><FaThumbsUp/>&nbsp;추천한 글</Linkto>
          </HoverOption>
          <HoverOption>
            <Linkto to="#" onClick={handleDelete}>회원 탈퇴</Linkto>
          </HoverOption>

          {dec.isAdmin &&
          <>
            <Line/>
            <HoverOption>
            <Linkto to="/ban"><PiSirenFill />&nbsp; 신고글 목록</Linkto>
            </HoverOption>
          </>
          }
        </LeftBottom>



        <RightBottom>
          {editMode ? (
            <>
            <InfoTitle>
              개인 정보 수정
            </InfoTitle>
            <br/>
            <InfoLine/>
            <Form onSubmit={handleUpdate}>
              <InfoContainer>
              <Label>
                닉네임 &nbsp;<VLine/>&nbsp;&nbsp;&nbsp;
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Label>
              <Label>
                아이디 &nbsp;<VLine/>&nbsp;&nbsp;&nbsp; {dec.id}
              </Label>
              <Label>
                패스워드 &nbsp;<VLine/>&nbsp;&nbsp;&nbsp;
                <Input
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                />
              </Label>
              </InfoContainer>
              <div style={{display:'flex',flexDirection:'column', alignItems:'flex-end', marginRight: '200px'}}>
                <Button type="submit">정보 수정</Button>
                <Button type="button" onClick={() => setEditMode(false)}>취소</Button>
              </div>
            </Form>
            </>
          ) : (
            <>
            <InfoTitle>
              사용자 정보
            </InfoTitle>
            <br/>
              <InfoLine/>
              <InfoContainer>
                <Label>
                닉네임 &nbsp;<VLine/>&nbsp;&nbsp; {username}
                </Label>
                <Label>
                아이디 &nbsp;<VLine/>&nbsp;&nbsp; {dec.id}
                </Label>
              </InfoContainer>
            </>
          )}
        </RightBottom>
      </Container>
    </>
  );
}

export default MyInfoPage;