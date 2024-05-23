//Button.jsx
import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    padding: 4px 8px;
    font-size: 14px;
    border-width: 1px;
    border-radius: 10px;
    border-color: white;
    height: 30px;
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