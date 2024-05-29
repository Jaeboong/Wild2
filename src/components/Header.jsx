import React from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from './Button';
import LOGO from '../image/KULOGO.png'

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 20px;
  background-color: rgba(235, 187, 187);
  border-bottom: 1px solid #ccc;
`;

const Logo = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 600;
  font-size: 26px;
  font-weight: bold;
  color: rgba(149, 29, 62);
`;
const LogoImg = styled.img`
  height: 5vh;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  margin-left: 50px;
`;

const Linkto = styled(NavLink)`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 550;
  margin-right: 30px;
  margin-left: 15px;
  text-decoration: none;
  padding-top: 5px;
  font-size: 19px;
  color: #000000;
  
  &:hover {
    color: #9a4d63;
  }
  &.active {
    color: #9a4d63;
  }
`;

const UserInfo = styled.div`
  padding-top: 2px;
  margin-left: auto;
`;

function Header(){
  const navigate = useNavigate();

  return (
    <HeaderWrapper>
      <div style={{display: 'flex'}}>
        <LogoImg 
        src={LOGO} 
        alt="고려대 로고"
        />
        <Logo>고려대 신문고</Logo>
      </div>
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
            localStorage.removeItem('token');
            navigate("/");
          }}
        />
      </UserInfo>
    </HeaderWrapper>
  );
}

export default Header;