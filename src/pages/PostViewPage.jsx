import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import CommentList from "../components/CommentList"; 
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import data from "../data.json";
import Header from "../components/Header";

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

const VoteContainer = styled.form`
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

const MiddleBox = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Recommends = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const RecommendButton = styled.button`
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f0f0f0;
    height: 30px;

    &:hover {
        background-color: #e0e0e0;
    }
`;

function PostViewPage(props){
    const navigate = useNavigate();
    const { postId } = useParams();

    const post = data.find((item) => {
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
        setCheckValue(e.target.value);
    };

    const onSubmitVote = (e) => {
        e.preventDefault();
        console.log("투표 제출됨:", checkValue);
        // 여기에서 투표 결과를 서버에 전송하거나 다른 작업을 수행할 수 있습니다.
    };

    const [isRecommended, setIsRecommended] = useState(false);

    const handleRecommend = () => {
        if (isRecommended) {
            post.recommends -= 1;
        } else {
            post.recommends += 1;
        }
        setIsRecommended(!isRecommended);
    };

    return (
        <>
        <Header />
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
                    <br /><h1>사진</h1><br />
                    <ContentText>{post.content}</ContentText>
                    <Recommends>추천 수: {post.recommends}</Recommends>
                </PostContainer>

                <MiddleBox>
                    <VoteContainer onSubmit={onSubmitVote}>
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
                        <Button type="submit" title="제출하기" />
                    </VoteContainer>
                    <RecommendButton onClick={handleRecommend}>
                        {isRecommended ? "추천 취소" : "추천하기"}
                    </RecommendButton>
                </MiddleBox>

                <CommentLabel>댓글</CommentLabel>
                <CommentList comments={post.comments} />

                <TextInput
                    height={30}
                    value={comment}
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