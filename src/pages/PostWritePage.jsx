//PostWritePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import Header from "../components/Header"

const Wrapper = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
    width: 100%;
    max-width: 720px;

    & > * {
        :not(:last-child){
            margin-bottom: 16px;
        }
    }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;


function PostWritePage(props){
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    return (
        <>
        <Header/>
        <Wrapper>
            <h1>민원 게시판</h1>
            <Container>
                <TextInput
                    height = {20}
                    value = {title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                    }}
                />

                <TextInput
                    height = {480}
                    value = {content}
                    onChange={(event) => {
                        setContent(event.target.value);
                    }}
                />

                <button>파일 첨부</button>
                <input type="checkbox" />익명

                <Footer>
                    <Button
                        title="글 작성하기"
                        onClick={() => {
                            navigate("/");
                        }}
                    />
                </Footer>
            </Container>
        </Wrapper>
        </>
    );
}

export default PostWritePage;