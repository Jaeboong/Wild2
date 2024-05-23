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

const VoteContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    padding: 8px 16px;
    border: 1px solid grey;
    border-radius: 8px;
    margin-top: 20px;
`;

const VoteRow = styled.div`
    display: flex;
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

const ReportButton = styled.button`
    font-size: 12px;
    display: flex;
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

function PostViewPage() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const [checkValue, setCheckValue] = useState('사용');
    const [hasRecommended, setHasRecommended] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);
    
    const token = localStorage.getItem('token');
    const payload = token.split('.')[1];
    const dec = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload), (c) => c.charCodeAt(0))));

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/posts/${postId}`);
                setPost(response.data);
                setIsAuthor(response.data.author === dec.nickname);
                setHasRecommended(response.data.recommendedBy.includes(dec.nickname));
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchPost();
    }, [postId]);

    const handleRecommendation = async () => {
        try {
            const url = `http://localhost:4000/api/posts/${postId}/recommend`;
            const method = hasRecommended ? 'DELETE' : 'POST';
            const response = await axios({
                method,
                url,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.status === 200) {
                setPost(prevPost => ({
                    ...prevPost,
                    recommends: hasRecommended ? prevPost.recommends - 1 : prevPost.recommends + 1
                }));
                setHasRecommended(!hasRecommended);
            } else {
                console.error("Error updating recommendation");
            }
        } catch (error) {
            console.error("Error updating recommendation:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.status === 200) {
                navigate("/complain");
            } else {
                console.error("Error deleting post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleEdit = () => {
        navigate(`/edit-post/${postId}`);
    };

    const checkOnlyOne = (e) => {
        let checkItem = document.getElementsByName("useType");
        Array.prototype.forEach.call(checkItem, function (el) {
            el.checked = false;
        });
        e.target.checked = true;
        setCheckValue(e.target.defaultValue);
    };

    if (!post) {
        return <p>Loading...</p>;
    }

    return (
        <>
        <Header/>
        <Wrapper>
            <Container>
                <Button
                    title="글 목록"
                    onClick={() => {
                        navigate("/complain");
                    }}
                />
                <PostContainer>
                    <TitleText>{post.title}</TitleText>
                    <AuthorText>
                        {post.author}
                        <ReportButton>신고하기</ReportButton>
                    </AuthorText>
                    <br/><h1>사진</h1><br/>
                    <ContentText>{post.content}</ContentText>
                </PostContainer>

                {isAuthor && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button title="수정" onClick={handleEdit} />
                        <Button title="삭제" onClick={handleDelete} />
                    </div>
                )}

                <div style={{display:"flex", justifyContent:"space-between"}}>
                <VoteContainer>
                    <h2>투표</h2><hr />
                    <VoteRow>
                    <input
                        type="checkbox"
                        id="agree"
                        name="useType"
                        value="찬성"
                        onChange={(e) => checkOnlyOne(e)}
                        checked={checkValue === "찬성"}
                    />
                    <label>찬성</label>
                    </VoteRow>
                    <VoteRow>
                    <input
                        type="checkbox"
                        id="disagree"
                        name="useType"
                        value="반대"
                        onChange={(e) => checkOnlyOne(e)}
                        checked={checkValue === "반대"}
                    />
                    <label>반대</label>
                    </VoteRow>
                </VoteContainer>
                
                <div style={{display: "flex", alignItems: "flex-end"}}>
                    <h2>추천수 : {post.recommends}</h2>
                </div>
                </div>
                    
                <div style={{display:"flex", justifyContent:"flex-end"}}>
                <Button
                    title="추천"
                    onClick={handleRecommendation}
                />
                </div>

                <CommentLabel>댓글</CommentLabel>
                {/* <CommentList comments={post.comments}/> */}

                <TextInput
                    height = {30}
                    value = {comment}
                    onChange={(event) => {
                        setComment(event.target.value);
                    }}
                />
                <div style={{display:"flex", justifyContent:"flex-end"}}>
                <Button
                    title="댓글 작성"
                    onClick={() => {
                        navigate("/");
                    }}
                />
                </div>
            </Container>
        </Wrapper>
        </>
    );
}

export default PostViewPage;