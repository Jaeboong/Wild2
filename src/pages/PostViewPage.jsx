import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import Header from "../components/Header";
import axios from "axios";
import CommentList from "../components/CommentList";

const baseURL = "http://localhost:8080";

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

const TitleText = styled.div`
    font-size: 28px;
    font-weight: 500;
`;

const AuthorText = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 400;
`;

const ReportButton = styled.button`
    font-size: 12px;
    display: flex;
`;

const ContentText = styled.div`
    font-size: 16px;
    line-height: 32px;
    white-space: pre-wrap;
`;

const CommentLabel = styled.div`
    font-size: 16px;
    font-weight: 500;
`;

function PostViewPage() {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const [bringedComment, setBringedComment] = useState([]);
    const [checkValue, setCheckValue] = useState('');
    const [hasReported, setHasReported] = useState(false);
    const [hasRecommended, setHasRecommended] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);
    const [author, setAuthor] = useState("");
    
    const location = useLocation();

    const token = localStorage.getItem('token');
    const payload = token.split('.')[1];
    const dec = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload), (c) => c.charCodeAt(0))));
    
    const checkOnlyOne = (e) => {
        e.target.checked = true;
        setCheckValue(e.target.defaultValue);
    };

    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/board/view/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            
            setPost(response.data.post);
            setBringedComment(response.data.comments);
            setAuthor(response.data.author);
            setIsAuthor(response.data.author === dec.username);
            setHasReported(response.data.hasReported);
            setHasVoted(response.data.hasVoted);
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [postId, hasRecommended, hasVoted, hasReported]);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

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
                `http://localhost:3001/board/recommend/${postId}`,
                { userid: dec.userid },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );// 백에서 추천했으면 -1, 안했으면 +1
        } catch (error) {
            console.error("Error updating recommendation:", error);
        }
    };

    const handleVote = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3001/board/vote/${postId}`,
                { userid: dec.id, checked: checkValue },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            setHasVoted(true);
        } catch (error) {
            console.error("Error updating vote:", error);
        }
    };

    const handleReport = async () => {
        try {
            const response = await axios.post(
                `http://localhost:4000/api/posts/${postId}/report`,
                { userid: dec.id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            setHasReported(true);
        } catch (error) {
            console.error("Error reporting post:", error);
        }
    };

    const handleComment = async () => {
        try {
            const response = await axios.post(
                `http://localhost:4000/api/posts/${postId}/comment`,
                { username: dec.nickname, content: comment },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            if (response.status === 200) {
                setComment("");
                fetchPost();  // 댓글 작성 후 게시글 정보를 다시 불러옴
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        }
    };
    
    const handleCopyClipBoard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert("클립보드에 링크가 복사되었습니다.");
        } catch (err) {
            console.log(err);
        }
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
                        navigate(`/${post.category}`);
                    }}
                />

                <PostContainer>
                    <TitleText>{post.title}</TitleText>
                    <AuthorText>
                        <div style={{display: "flex", flexDirection: "column"}}>
                        {author}
                        {/* 날짜 */}
                        </div>

                        <div>
                        <button
	                        onClick={() => handleCopyClipBoard(`${baseURL}${location.pathname}`)}
                        >
                            주소복사 {/*아이콘으로 변경 예정*/}
                        </button>
                        <ReportButton onClick={handleReport}>신고하기</ReportButton>
                        </div>
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

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {!hasVoted ? (
                            <VoteContainer>
                                <h2>투표</h2><hr />
                                <VoteRow>
                                    <input
                                        type="checkbox"
                                        value="agree"
                                        onChange={(e) => checkOnlyOne(e)}
                                        checked={checkValue === "agree"}
                                    />
                                    <label>찬성</label>
                                </VoteRow>
                                <VoteRow>
                                    <input
                                        type="checkbox"
                                        value="disagree"
                                        onChange={(e) => checkOnlyOne(e)}
                                        checked={checkValue === "disagree"}
                                    />
                                    <label>반대</label>
                                </VoteRow>
                                <Button title='제출' onClick={handleVote} />
                            </VoteContainer>
                        ) : (
                            <div>
                                <h2>투표 결과</h2>
                                {/* <p>찬성: {voteInfo.votesFor}</p>
                                <p>반대: {voteInfo.votesAgainst}</p> */}
                            </div>
                        )}

                        <div style={{ display: "flex", alignItems: "flex-end" }}>
                            <h2>추천수 : {post.recommend}</h2> {/*따봉 아이콘으로 변경 예정*/}
                        </div>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button 
                            title="추천하기"
                            onClick={handleRecommendation}
                        />
                    </div>

                <CommentLabel>댓글</CommentLabel>
                <CommentList comments={bringedComment}/>

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