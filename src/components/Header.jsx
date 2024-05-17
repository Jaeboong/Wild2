import React from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from './Button';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 20px;
  background-color: #f3f3f3;
  border-bottom: 1px solid #ccc;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  margin-left: 50px;
`;

const Linkto = styled(NavLink)`
  margin-right: 20px;
  margin-left: 15px;
  text-decoration: none;
  padding-top: 5px;
  font-size: 15px;
  color: black;
`;

const UserInfo = styled.div`
  padding-top: 2px;
  margin-left: auto;
`;

function Header(){
  const navigate = useNavigate();

  return (
    <HeaderWrapper>
      <Logo>고려대 신문고</Logo>
      <Navigation>
        <Linkto to="/home">Home</Linkto>
        <Linkto to="/complain">민원 게시판</Linkto>
        <Linkto to="/report">제보 게시판</Linkto>
        <Linkto to="/hot">HOT 게시판</Linkto>
        <Linkto to="/announce">공지사항</Linkto>
      </Navigation>
      <UserInfo>
        <Linkto to="/info">내정보</Linkto>
        <Button 
          title="로그아웃" 
          onClick={() => {
            navigate("/login");
          }}
        />
      </UserInfo>
    </HeaderWrapper>
  );
}

export default Header;