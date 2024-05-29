import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InfoInput from '../components/InfoInput';
import { NavLink, useNavigate } from 'react-router-dom';
import LoginButton from '../components/LoginButton';
import axios from 'axios';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
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
          <form style={{ display: 'flex', flexDirection: 'column'}}>
            <LoginTitle>Login</LoginTitle>
            <br/>
            <InfoInput name='ID' value={ID} onChange={onIDHandler}/>
            <InfoInput type= 'password' name='Password' value={Password} onChange={onPasswordHandler}/>

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