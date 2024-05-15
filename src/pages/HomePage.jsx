import React from 'react';
import styled from 'styled-components';
import SummaryBoard from '../components/SummaryBoard';
import Header from "../components/Header"

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

function HomePage() {
  return (
    <>
      <Header/>
      <Container>
        <LeftBottom>
          <h1>배너</h1>
        </LeftBottom>
        <RightBottom>
          <SummaryBoard />
          <SummaryBoard />
        </RightBottom>
      </Container>
    </>
  );
};

export default HomePage;