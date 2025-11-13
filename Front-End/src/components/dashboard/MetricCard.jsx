import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Label = styled.h4`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const Value = styled.p`
  margin: 10px 0 0 0;
  font-size: 28px;
  font-weight: bold;
  color: ${(props) => props.color || '#FF6B00'};
`;

export default function MetricCard({ label, value, color }) {
    return (
        <Card>
            <Label>{label}</Label>
            <Value color={color}>{value}</Value>
        </Card>
    );
}
