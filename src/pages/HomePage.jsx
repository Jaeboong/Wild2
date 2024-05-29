import React from 'react';
import styled from 'styled-components';
import SummaryBoard from '../components/SummaryBoard';
import Header from "../components/Header";
import imagefile from "../image/고려대배너.jpg"

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const LeftBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 calc(50%);
`;

const RightBottom = styled.div`
  flex: 1;
  margin-top: 60px;
  margin-left: 60px;
`;

const BannerImage = styled.img`
  max-width: 100vh;
  height: 93.8vh;
`;

function HomePage() {
  return (
    <>
      <Header />
      <Container>
        <LeftBottom>
          <BannerImage 
            src={imagefile} 
            alt="고려대 배너"
          />
        </LeftBottom>
        <RightBottom>
          <SummaryBoard title="공지사항" postwhat="announce" link="/announce" />
          <SummaryBoard title="Hot 게시판" postwhat="hot" link="/hot" />
        </RightBottom>
      </Container>
    </>
  );
};

export default HomePage;