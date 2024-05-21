//PostWritePage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    justify-content: space-between;
    align-items: center;
`;


function PostWritePage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const boardType = queryParams.get('board');
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    const handlePostSubmit = async (event) => {
        event.preventDefault();
        const author = isAnonymous ? "익명" : localStorage.getItem("nickname");

        try {
            const response = await fetch("http://localhost:4000/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                title,
                content,
                author,
                board: boardType
            })
        });

            if (response.ok) {
                navigate(`/${boardType}`);
            } else {
                console.error('Error creating post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <>
            <Header />
            <Wrapper>
                <h1>{boardType === 'complain' ? '민원 게시판' : '제보 게시판'}</h1>
                <Container>
                    <TextInput
                        height={20}
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value);
                        }}
                        placeHolder="제목"
                    />

                    <TextInput
                        height={480}
                        value={content}
                        onChange={(event) => {
                            setContent(event.target.value);
                        }}
                        placeHolder="내용을 입력하세요"
                    />

                    <Footer>
                        <input type="file" multiple />
                        <div>
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={() => setIsAnonymous(!isAnonymous)}
                            /> 익명
                        </div>
                    </Footer>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            title="글 작성하기"
                            onClick={handlePostSubmit}
                        />
                    </div>
                </Container>
            </Wrapper>
        </>
    );
}

export default PostWritePage;