import styled from "styled-components";

export const Container = styled.header`
  background-color: #007bff;
  color: white;
  padding: 1rem;
  text-align: center;
  position: relative;
`;

export const ChatButtonStyled = styled.button`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #004085;
  }
`;
