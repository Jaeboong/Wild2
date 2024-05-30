import React from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from './Button';
import LOGO from '../image/KULOGO.png'

const FirstHeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: #8C0327;
  border-bottom: 1px solid #ccc;
`;

const SecondHeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  background-color: white;/*rgba(235, 187, 187)*/
  border-bottom: 1px solid #ccc;
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

const LinktoInfo = styled(NavLink)`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 550;
  margin-right: 30px;
  margin-left: 15px;
  text-decoration: none;
  padding-top: 5px;
  font-size: 19px;
  color: white;
  
  &:hover {
    color: #d698aa;
  }
  &.active {
    color: #d698aa;
  }
`;

const Linkto = styled(NavLink)`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 550;
  margin-right: 30px;
  margin-left: 15px;
  text-decoration: none;
  padding-top: 5px;
  font-size: 22px;
  color: #000000;
  
  &:hover {
    color: #8C0327;
  }
  &.active {
    color: #8C0327;
  }
`;

const UserInfo = styled.div`
  padding-top: 2px;
  margin-left: auto;
`;

function Header(){
  const navigate = useNavigate();

  return (
    <>
    <FirstHeaderWrapper>      
      <UserInfo>
        <LinktoInfo to="/info">내정보</LinktoInfo>
        <Button 
          title="로그아웃" 
          onClick={() => {
            localStorage.removeItem('token');
            navigate("/");
          }}
        />
      </UserInfo>
    </FirstHeaderWrapper>
    
    <SecondHeaderWrapper>
        <LogoImg 
        src={LOGO} 
        alt="고려대 로고"
        />
      <Navigation>
        <Linkto to="/home">Home</Linkto>
        <Linkto to="/complain">민원 게시판</Linkto>
        <Linkto to="/report">제보 게시판</Linkto>
        <Linkto to="/hot">HOT 게시판</Linkto>
        <Linkto to="/announce">공지사항</Linkto>
      </Navigation>
    </SecondHeaderWrapper>
    </>
  );
}

export default Header;