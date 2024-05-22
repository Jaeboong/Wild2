import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  width: 315px;
  height: 40px;
  border: none;
  border-radius: 5px; 
  background-color: #8C0327;
  color: white;
  font-size: 16px;
  cursor: pointer;
`;

function SignUpButton(props){
    const { title, onClick } = props;

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const nickname = e.target.nickname.value;
        const id = e.target.id.value;
        const pw = e.target.pw.value;
        fetch('/', {
            method: 'POST',
            body: JSON.stringify({
                nickname,
                id,
                pw,
            }),
        });

    }

    return <StyledButton onClick={onClick} onSubmit={onSubmitHandler}> {title || "button"} </StyledButton>;
}

export default SignUpButton;