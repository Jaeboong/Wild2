import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import CommentList from "../components/CommentList"; 
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import data from "../data.json";
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
`

const AuthorText = styled.p`
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 400;
`

const ReportButton = styled.button`
    font-size: 12px;
    display: flex;
`

const ContentText = styled.p`
    font-size: 16px;
    line-height: 32px;
    white-space: pre-wrap;
`

const CommentLabel = styled.p`
    font-size: 16px;
    font-weight: 500;
`

function PostViewPage(props){
    const navigate = useNavigate();
    const {postId} = useParams();

    const post = data.find((item)=>{
        return item.id == postId;
    });

    const [comment, setComment] = useState("");

    const [checkValue, setCheckValue] = useState('사용');
    const checkOnlyOne = (e) => {
        let checkItem = document.getElementsByName("useType");
        Array.prototype.forEach.call(checkItem, function (el) {
        	el.checked = false;
        });
        e.target.checked = true;
        setCheckValue(e.target.defaultValue);
	};

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

                <CommentLabel>댓글</CommentLabel>
                <CommentList comments={post.comments}/>

                <TextInput
                    height = {30}
                    value = {comment}
                    onChange={(event) => {
                        setComment(event.target.value);
                    }}
                />

                <Button
                    title="댓글 작성"
                    onClick={() => {
                        navigate("/");
                    }}
                />
            </Container>
        </Wrapper>
        </>
    );
}

export default PostViewPage;