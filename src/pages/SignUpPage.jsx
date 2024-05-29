import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import InfoInput from '../components/InfoInput';
import { NavLink, useNavigate } from 'react-router-dom';
import SignUpButton from '../components/SignUpButton';
import axios from 'axios';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

function SignUpPage() {
  const [NickName, setNickName] = useState("");
  const [Id, setID] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Agree, setAgree] = useState(false);

  const onNickNameHandler = (event) => {
    setNickName(event.currentTarget.value);
  }
  const onIDHandler = (event) => {
    setID(event.currentTarget.value);
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  }
  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  }
  const onAgreeHandler = () => {
    setAgree(!Agree);
  }

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);


  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/signup', {
        username: NickName,
        userid: Id,
        pw: Password,
        cpw: ConfirmPassword
      });
  
      if (response.status === 201) {
        alert('가입되었습니다. 아이디를 입력하여 로그인 해주세요!');
        navigate(`/`);
      } else {
        alert(response.data);
        navigate(`/signup`);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('가입 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <Wrapper>
      <form onSubmit={onSubmitHandler} style={{ display: 'flex', flexDirection: 'column' }}>
        <LoginTitle>SignUp</LoginTitle>
        <br />
        <InfoInput name='NickName' value={NickName} onChange={onNickNameHandler} />
        <InfoInput name='id' value={Id} onChange={onIDHandler} />
        <InfoInput name='Password' value={Password} onChange={onPasswordHandler} />
        <InfoInput name='ConfirmPassword' value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
        <CheckboxLabel>
          <Checkbox type="checkbox" checked={Agree} onChange={onAgreeHandler} />
          I agree to all the Terms and Privacy Policies
        </CheckboxLabel>
        <SignUpButton
          title="Sign Up"
          onClick={() => { }}
        />
      </form>
      <Description>
        Already have an account?
        <MovePage to="/">
          Login
        </MovePage>
      </Description>
    </Wrapper>
  )
}

export default SignUpPage;



{/* <>
<h1>유저 정보</h1>
{userInfo?.map((user) => (
  <div key={user.userid} style={{ display: 'flex' }}>
    <div>{user.userid}</div>
    <div>{user.nickname}</div>
    <div>{user.id}</div>
    <div>{user.pw}</div>
  </div>
))}
</> */}