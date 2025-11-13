import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
`;

const Question = styled.h3`
  margin: 0 0 20px 0;
  font-size: 18px;
`;

const AnswerGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-around;
`;

const AnswerButton = styled.button`
  width: 50px;
  height: 50px;
  border: 2px solid #ddd;
  border-radius: 50%;
  background-color: ${(props) => (props.selected ? '#FF6B00' : 'white')};
  color: ${(props) => (props.selected ? 'white' : '#333')};
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;

  &:hover {
    border-color: #FF6B00;
  }
`;

export default function QuestionCard({ question, answer, onChange }) {
    return (
        <Card>
            <Question>{question.text}</Question>
            <AnswerGroup>
                {[1, 2, 3, 4, 5].map((value) => (
                    <AnswerButton
                        key={value}
                        selected={answer === value}
                        onClick={() => onChange(value)}
                    >
                        {value}
                    </AnswerButton>
                ))}
            </AnswerGroup>
        </Card>
    );
}
