import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Reset some basic styles */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Base body styles */
  body {
    font-family: 'Inter', sans-serif;
    background-color: #f9f9f9;
    color: #333;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Anchor tag styles */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* Button reset */
  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    background: none;
  }

  /* Root div to take full height */
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

export default GlobalStyles;
