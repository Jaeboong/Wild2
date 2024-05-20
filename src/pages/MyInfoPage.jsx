import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Header from "../components/Header"

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
        </RightBottom>
      </Container>
    </>
  );
};

export default MyInfoPage;