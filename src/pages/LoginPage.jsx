import React, { useState } from 'react';
import styled from 'styled-components';
import InfoInput from '../components/InfoInput';
import { NavLink, useNavigate } from 'react-router-dom';
import LoginButton from '../components/LoginButton';


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
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const onEmailHandler = (event) => {
      setEmail(event.currentTarget.value);
    }
    const onPasswordHandler = (event) => {
      setPassword(event.currentTarget.value);
    }

    const navigate = useNavigate();

    return (
      <Wrapper>
          <form style={{ display: 'flex', flexDirection: 'column'}}>
            <LoginTitle>Login</LoginTitle>
            <br/>
            <InfoInput name='Email' value={Email} onChange={onEmailHandler}/>
            <InfoInput name='Password' value={Password} onChange={onPasswordHandler}/>
            <MovePage href = "/"> Forgot Password? </MovePage>
            <LoginButton 
              title="Login" 
              onClick={() => {
                navigate("/home");
              }}/>
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