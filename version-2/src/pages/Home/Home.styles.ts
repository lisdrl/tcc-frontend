import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 100vw;
  font-family: 'Arial', sans-serif;
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  padding: 1rem;
  background-color: #f4f4f4;
`;

export const Sidebar = styled.div`
  width: 250px;
  background-color: #fff;
  margin-right: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
`;
