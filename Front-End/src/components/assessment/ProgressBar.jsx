import React from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin: 20px 0;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #FF6B00;
  width: ${(props) => props.progress}%;
  transition: width 0.3s ease;
`;

export default function ProgressBar({ progress }) {
    return (
        <ProgressContainer>
            <Progress progress={progress} />
        </ProgressContainer>
    );
}
