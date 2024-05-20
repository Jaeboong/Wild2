import React from 'react';
import styled from 'styled-components';
import SummaryBoard from '../components/SummaryBoard';
import Header from "../components/Header";

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
            src={`${process.env.PUBLIC_URL}/image/고려대배너.jpg`} 
            alt="고려대 배너"
          />
        </LeftBottom>
        <RightBottom>
          <SummaryBoard postwhat="공지" />
          <SummaryBoard postwhat="민원" />
        </RightBottom>
      </Container>
    </>
  );
};

export default HomePage;