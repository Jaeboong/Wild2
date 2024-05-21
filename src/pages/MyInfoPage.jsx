import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Header from "../components/Header"
import base64 from "base-64";

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
  background-color: rgba(26, 169, 201, 0.3);
`;

const RightBottom = styled.div`
  display: flex;
  align-items: center;
  flex-direction:column;
  flex: 1;
  background-color: rgba(91, 178, 213, 0.2);
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

function MyInfoPage() {

  const token = localStorage.getItem("token");
  const payload = token.split('.')[1];
  const dec = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload), c => c.charCodeAt(0))));
  console.log(dec.nickname); //토큰을 디코딩해서 사용.. ////////이게 맞나?

  return (
    <>
    <Header/>
      <Container>
        <LeftBottom>
          <h2>User Profile</h2>
          <Linkto to="/">● 개인 정보 수정</Linkto>
          <Linkto to="/">● 내가쓴 글</Linkto>
          <Linkto to="/">● 추천한 글</Linkto>
        </LeftBottom>
        <RightBottom>
          <h1>사용자 정보</h1>
          <h1>닉네임 : {dec.nickname}</h1>
          <h1>아이디 : {dec.id}</h1>
          <h1>패스워드 : {dec.pw}</h1>
        </RightBottom>
      </Container>
    </>
  );
};

export default MyInfoPage;