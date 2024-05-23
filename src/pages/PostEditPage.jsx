import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import Header from "../components/Header";
import axios from "axios";

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
    max-width: 900px;

    & > * {
        :not(:last-child){
            margin-bottom: 16px;
        }
    }
`;

const PostContainer = styled.div`
`;

const TitleText = styled.p`
    font-size: 28px;
    font-weight: 500;
`;

const AuthorText = styled.p`
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 400;
`;

const ContentText = styled.p`
    font-size: 16px;
    line-height: 32px;
    white-space: pre-wrap;
`;

const CommentLabel = styled.p`
    font-size: 16px;
    font-weight: 500;
`;

function PostEditPage() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/posts/${postId}`);
                const postData = response.data;
                setPost(postData);
                setTitle(postData.title);
                setContent(postData.content);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching post:", error);
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/api/posts/${postId}`, {
                title,
                content,
                author: localStorage.getItem("nickname")
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.status === 200) {
                navigate(`/post/${postId}`);
            } else {
                console.error("Error updating post");
            }
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <>
        <Header/>
        <Wrapper>
            <Container>
                <Button
                    title="뒤로 가기"
                    onClick={() => {
                        navigate(-1);
                    }}
                />
                <PostContainer>
                    <TitleText>글 수정하기</TitleText>
                    <TextInput
                        height={30}
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="제목"
                    />
                    <TextInput
                        height={200}
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="내용"
                    />
                </PostContainer>

                <div style={{display:"flex", justifyContent:"flex-end"}}>
                    <Button
                        title="저장"
                        onClick={handleSave}
                    />
                </div>
            </Container>
        </Wrapper>
        </>
    );
}

export default PostEditPage;