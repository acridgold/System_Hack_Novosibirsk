import React from 'react';
import styled from 'styled-components';

const TipContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const TipCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #FF6B00;
`;

const TipTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #333;
`;

const TipText = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
`;

const Checkbox = styled.input`
  margin-top: 10px;
  cursor: pointer;
`;

export default function TipList({ tips }) {
    return (
        <TipContainer>
            {tips.map((tip, index) => (
                <TipCard key={index}>
                    <TipTitle>{tip.title}</TipTitle>
                    <TipText>{tip.description}</TipText>
                    <Checkbox type="checkbox" defaultChecked={tip.completed} />
                </TipCard>
            ))}
        </TipContainer>
    );
}
