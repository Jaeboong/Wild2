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
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #6c6c74;
  font-size: 12px;
`;

const Checkbox = styled.input`
  margin-right: 5px;
`;

function SignUpPage(){
    const [NickName, setNickName] = useState("");
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [Agree, setAgree] = useState(false);

    const onNickNameHandler = (event) => {
        setNickName(event.currentTarget.value);
    }
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    const onAgreeHandler = () => {
        setAgree(!Agree);
    }

    const navigate = useNavigate();

    return (
      <Wrapper>
          <form style={{ display: 'flex', flexDirection: 'column'}}>
            <LoginTitle>SignUp</LoginTitle>
            <br/>
            <InfoInput name='NickName' value={NickName} onChange={onNickNameHandler}/>
            <InfoInput name='Email' value={Email} onChange={onEmailHandler}/>
            <InfoInput name='Password' value={Password} onChange={onPasswordHandler}/>
            <CheckboxLabel>
              <Checkbox type="checkbox" checked={Agree} onChange={onAgreeHandler} />
              I agree to all the Terms and Privacy Policies
            </CheckboxLabel>
            <LoginButton 
              title="Sign Up" 
              onClick={() => {
                navigate("/home");
              }}/>
            <Description>
              Already have an account?  
              <MovePage to = "/login">
                Login 
              </MovePage>
            </Description>
          </form>
      </Wrapper>
    )
}

export default SignUpPage;