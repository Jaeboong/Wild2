import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
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
  text-decoration: none;
  padding-top: 5px;
  margin-left: 15px;
  font-size: 15px;
  color: black;

`;

const UserInfo = styled.div`
    padding-top: 2px;
    margin-left: auto;
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <Logo>로고</Logo>
      <Navigation>
        <Linkto to="/">Home</Linkto>
        <Linkto to="/">민원 게시판</Linkto>
        <Linkto to="/">제보 게시판</Linkto>
        <Linkto to="/">HOT 게시판</Linkto>
        <Linkto to="/">공지사항</Linkto>
      </Navigation>
      <UserInfo>
        <Linkto to="/">내정보</Linkto>
        <Button title="로그아웃" />
      </UserInfo>
    </HeaderWrapper>
  );
}

export default Header;