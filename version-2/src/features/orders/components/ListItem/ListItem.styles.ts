import styled from "styled-components";

export const Item = styled.li`
  padding: 0.5rem;
  background-color: #fff;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export const OrderHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
