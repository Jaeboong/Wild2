import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import Header from "../components/Header";
import axios from "axios";
import CommentList from "../components/CommentList";
import Graph from "../components/Graph";

import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa6";
import { FiShare2 } from "react-icons/fi";
import { AiFillAlert } from "react-icons/ai";

const baseURL = "https://seungyun-park.github.io/udr-project";

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

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;  
`;

const PostContainer = styled.div`
    padding: 16px;
    border: 1px solid grey;
    border-radius: 8px;
    margin-top: 20px;
`;

const AuthorText = styled.div`
    display: flex;
    justify-content: flex-start;
    font-size: 12px;
    font-weight: 400;
`;

const DateText = styled.div`
    display: flex;
    justify-content: flex-start;
    font-size: 10px;
    font-weight: 400;
    color: #989898;
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

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items:flex-end;
`;

const IconWrapper = styled.div`
  display: flex;
  padding: 5px;
  border: 2px solid black; 
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    border-color: #a9a9a9; 
  }
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
    const [agree, setAgree] = useState(0);
    const [disagree, setDisagree] = useState(0);
    const [isAuthor, setIsAuthor] = useState(false);
    const [author, setAuthor] = useState("");
    const [needVote, setNeedVote] = useState(false);
    const [voteTitle, setVoteTitle] = useState("");
    
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
            const response = await axios.get(`http://localhost:3001/board/view/${postId}`,
            {
                params:{
                    userid: dec.id,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            
            setPost(response.data.post);
            setBringedComment(response.data.comments);
            setAuthor(response.data.author);
            setIsAuthor(response.data.author === dec.username);
            setHasRecommended(response.data.hasRecommended);
            setHasReported(response.data.hasReported);
            setHasVoted(response.data.hasVoted);
            setAgree(response.data.agreeCount);
            setDisagree(response.data.disagreeCount);
            setVoteTitle(response.data.voteTitle);
            setNeedVote(response.data.needVote);
            console.log(voteTitle);
            console.log(response.data.voteTitle);
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [postId, hasRecommended, hasVoted, hasReported]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm('게시글을 삭제하시겠습니까?');
        if (confirmDelete) {
        try {
            console.log(postId);
            const response = await axios.delete(`http://localhost:3001/post/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.status === 200) {
                alert("게시글이 정상적으로 삭제되었습니다.");
                navigate(`/${post.category}`);
            } else {
                console.error("Error deleting post");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    }
    };

    const handleRecommendation = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3001/board/recommend/${postId}`,
                {},
                {
                    params: { // 쿼리 파라미터로 userid 전달
                        userid: dec.id,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );// 백에서 추천했으면 -1, 안했으면 +1
            setHasRecommended(response.data.recommended);
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
        // 이미 신고를 했으면 함수 종료
        if (hasReported) {
            alert("이미 신고하셨습니다.");
            return;
        }
    
        try {
            const response = await axios.post(
                `http://localhost:3001/board/reported/${postId}`,
                {}, 
                {
                    params: {
                        userid: dec.id
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            setHasReported(response.data);
            alert("신고 완료!");
        } catch (error) {
            console.error("Error reporting post:", error);
        }
    };

    const handleComment = async () => {
        try {
            const response = await axios.post(
                `http://localhost:3001/board/comment/${postId}`,
                {},
                {
                    params: { 
                        userid: dec.id, content: comment
                    },
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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString('ko-KR', options);
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
                <PostHeader>
                    <div>
                    <TitleText>{post.title}</TitleText>
                    <AuthorText>
                        {author}
                    </AuthorText>
                    <DateText>
                     {formatDate(post.date)}
                    </DateText>
                    </div>

                    <IconContainer>
                        <IconWrapper>
                            <FiShare2 
                            size='24px'
                            onClick={() => handleCopyClipBoard(`${baseURL}${location.pathname}`)}
                            title="공유하기"
                            />
                        </IconWrapper>
                        <IconWrapper>
                            <AiFillAlert 
                            size='24px'
                            onClick={handleReport}
                            title="게시글 신고하기"
                            />
                        </IconWrapper>
                    </IconContainer>
                </PostHeader>
                

                    
                    <br/><h1>사진</h1><br/>
                    <ContentText>{post.content}</ContentText>

                {(isAuthor || dec.isAdmin) && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button title="수정" onClick={() => {
                            navigate(`/edit-post/${postId}`);
                            }
                        } />
                        <Button title="삭제" onClick={handleDelete} />
                    </div>
                )}
                </PostContainer>
                
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {needVote && !hasVoted && (
                            <VoteContainer>
                                <h2>{voteTitle}</h2><hr />
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
                        )}
                        {needVote && hasVoted && (
                            <VoteContainer>
                                <h2>{voteTitle} <br/>투표 결과</h2>
                                <p>찬성: {agree}</p>
                                <p>반대: {disagree}</p>
                                <Graph agree={agree} disagree={disagree}/>
                            </VoteContainer>
                        )}

                        <div style={{ padding: "10px", 
                        display: "flex", 
                        marginLeft: 'auto',
                        fontSize: "25px", 
                        color: "red"}}
                        >
                            {hasRecommended ?  
                            <FaThumbsUp
                            style={{color: "red"}}
                            title="추천취소"
                            onClick={handleRecommendation}
                            size="28px"
                            cursor="pointer"
                            />
                            : 
                            <FaRegThumbsUp 
                            style={{color: "red"}}
                            title="추천하기"
                            onClick={handleRecommendation}
                            size="28px"
                            cursor="pointer"
                            />
                            } 
                            &nbsp; {post.recommend}
                        </div>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        
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