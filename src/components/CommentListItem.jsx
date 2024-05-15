//CommentListItem.jsx
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    width: calc(100% - 32px);
    padding: 8px;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border: 1px solid grey;
    border-radius: 8px;
    background: white;
`;

const CommentText = styled.p`
    font-size: 15px;
`;

const Name = styled.p`
    font-size: 20px;
    font-weight: 500;
`;

function CommentListItem(props){
    const {comment} = props;

    return (
        <Wrapper>
            <Name>{comment.name}</Name>
            <CommentText>{comment.content}</CommentText>
        </Wrapper>
    );
}

export default CommentListItem;