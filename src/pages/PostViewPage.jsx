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
    
    const checkOnlyOne = (e) => {
        let checkItem = document.getElementsByName("useType");
        Array.prototype.forEach.call(checkItem, function (el) {
            el.checked = false;
        });
        e.target.checked = true;
        setCheckValue(e.target.defaultValue);
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response1 = await axios.get(`http://localhost:4000/api/posts/${postId}`);
                setPost(response1.data);
                setIsAuthor(response1.data.author === dec.nickname);

                const response2 = await axios.get(`http://localhost:4000/api/posts/${postId}/comment`);
                setComment(response2.data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchPost();
    }, [postId /*댓글, 투표, 추천 하면 바뀌도록 */]);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/posts/${postId}`);

            if (response.status === 200) {
                alert("게시글이 정상적으로 삭제되었습니다.");
                navigate(`/${post.board}`);
            } else {
                console.error("Error deleting post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    const handleRecommendation = async () => {
        try {
            const response = await axios.post(
                `http://localhost:4000/api/posts/${postId}/recommend`,
            {
                userid: dec.id,
            });
            //추천수 정보 받아와서 렌더링
        } catch (error) {
            console.error("Error updating recommendation:", error);
        }
    };

    const handleVote = async () => {
        try {
            await axios.post(
                `http://localhost:4000/api/posts/${postId}/vote`,
            {
                userid: dec.id,
            });
        } catch (error) {
            console.error("Error updating recommendation:", error);
        }
    };

    const handleReport = async () => {
        try {
            const response = await axios.post(
                `http://localhost:4000/api/posts/${postId}/report`,
            {
                userid: dec.id,
            });
        } catch (error) {
            console.error("Error updating recommendation:", error);
        }

        // 바로 투표 정보 받아오기 ??
    };

    const handleComment = async () => {
        try {
            const response = await axios.post(
                `http://localhost:4000/api/posts/${postId}/comment`,
            {
                username: dec.nickname,
                content: comment,
            });
        } catch (error) {
            console.error("Error updating recommendation:", error);
        }
    }

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
                        navigate(`/${post.board}`);
                    }}
                />
                <PostContainer>
                    <TitleText>{post.title}</TitleText>
                    <AuthorText>
                        {post.author}
                        <ReportButton onClick={handleReport}>신고하기</ReportButton>
                    </AuthorText>
                    <br/><h1>사진</h1><br/>
                    <ContentText>{post.content}</ContentText>
                </PostContainer>

                {isAuthor && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button title="수정" onClick={() => {
                            navigate(`/edit-post/${postId}`);
                            }
                        } />
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
                    <Button title='제출' onClick={handleVote}/>
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
                {/* <CommentList comments={comment}/> */}

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
                    onClick={handleComment}
                />
                </div>
            </Container>
        </Wrapper>
        </>
    );
}

export default PostViewPage;