import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InfoInput from '../components/InfoInput';
import { NavLink, useNavigate } from 'react-router-dom';
import LoginButton from '../components/LoginButton';
import axios from 'axios';

// 배경색 설정
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #D6CDBE; // 이미지 배경색과 동일하게 설정
`;

const LoginTitle = styled.h1`
  margin-bottom: 1px;
  font-family: 'Nunito';
`;

const Description = styled.div`
  display:flex;
  justify-content: center;
  color: #6c6c74;
  font-size: 12px;
`;

const MovePage = styled(NavLink)`
  margin-left: 5px;
  margin-bottom: 8px;
  color: red;
  font-size: 12px;
  text-decoration: none;
`

const Logo = styled.img`
  width: px; // 기존 크기에서 1.5배 증가
  margin-bottom: 20px;
`;

const StyledInput = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  &::placeholder {
    color: #bbb; // 글자를 흐리게 설정
  }
`;

function LoginPage(){
    const [ID, setID] = useState("");
    const [Password, setPassword] = useState("");
    const [loginCheck, setLoginCheck] = useState(false); // 로그인 상태 체크

    const onIDHandler = (event) => {
      setID(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
      setPassword(event.currentTarget.value);
    }

    const navigate = useNavigate();

    const handleLogin = async (event) => {
      // 로그인 처리 로직
      console.log('hi');
      event.preventDefault();
      await new Promise((r) => setTimeout(r, 500));
  
      try {
          const response = await axios.post(
              "http://localhost:3001/login",
              {
                  userid: ID,
                  password: Password,
              },
              {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              }
          );
  
          const result = response.data;
  
          if (response.status === 200) {
              setLoginCheck(false);
              // local storage에 토큰 저장
              localStorage.setItem("token", result.token);
  
              // 토큰 디코딩
              const payload = result.token.split('.')[1];
              const dec = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload), c => c.charCodeAt(0))));
  
              console.log("로그인성공, 아이디:" + dec.id);
              alert(`${dec.username}님 환영합니다 !`);
              navigate("/home"); // 성공시 홈으로 이동
          }
      } catch (error) {
          console.error("로그인 실패:", error);
          alert("틀린 정보입니다. 다시 입력해주세요.");
          setLoginCheck(true);
      }
  };

    return (
      <Wrapper>
          {/* 로그인 페이지 상단에 로고 이미지 추가 */}
          <Logo src="https://sejong.korea.ac.kr/mbshome/mbs/kr/images/sub/s_img010201_logo1.png" alt="Logo" />
          <form style={{ display: 'flex', flexDirection: 'column'}}>
            <LoginTitle>Login</LoginTitle>
            <br/>
            {/* 수정된 입력 필드 */}
            <StyledInput 
              type='text' 
              placeholder='아이디' 
              value={ID} 
              onChange={onIDHandler} 
              onFocus={(e) => e.target.placeholder = ''} 
              onBlur={(e) => e.target.placeholder = '아이디'}
            />
            <StyledInput 
              type='password' 
              placeholder='비밀번호' 
              value={Password} 
              onChange={onPasswordHandler} 
              onFocus={(e) => e.target.placeholder = ''} 
              onBlur={(e) => e.target.placeholder = '비밀번호'}
            />
            <MovePage href = "/"> Forgot Password? </MovePage>
            <LoginButton 
              title="Login" 
              onClick = {handleLogin}
            />
            <Description>
              Don't have an account?  
              <MovePage to = "/signup">
                Sign Up
              </MovePage>
            </Description>
          </form>
      </Wrapper>
    )
}

export default LoginPage;