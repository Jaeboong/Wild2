//Button.jsx
import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    padding: 4px 8px;
    font-size: 18px;
    border-width: 2px;
    border-radius: 10px;
    border-color: white;
    height: 35px;
    cursor: pointer;

    color: white;
    background-color: #8C0327;
    &:hover{
        background: #d34268;
    }
`;

function Button(props){
    const { title, onClick } = props;

    return <StyledButton onClick={onClick}> {title || "button"} </StyledButton>;
}

export default Button;