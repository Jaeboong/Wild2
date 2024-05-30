import React from 'react';
import styled from 'styled-components';
import SummaryBoard from '../components/SummaryBoard';
import Header from "../components/Header";
import imagefile from "../image/신문고배너.png"

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const LeftBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 calc(50%);
  margin-top: 30px;
`;

const RightBottom = styled.div`
  flex: 1;
  margin-left: 60px;
  margin-top: 30px;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 45vh;
`;

function HomePage() {
  return (
    <>
      <Header />
          <BannerImage 
            src={imagefile} 
            alt="고려대 배너"
          />
      <Container>
        <LeftBottom>
          <SummaryBoard title="공지사항" postwhat="announce" link="/announce" />
        </LeftBottom>
        <RightBottom>
          <SummaryBoard title="Hot 게시판" postwhat="hot" link="/hot" />
        </RightBottom>
      </Container>
    </>
  );
};

export default HomePage;