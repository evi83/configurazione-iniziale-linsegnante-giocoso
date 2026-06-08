import { createGlobalStyle, ThemeProvider } from 'styled-components';

export const theme = {
  primary: '#9E7FFF', // Purple
  secondary: '#38bdf8', // Light Blue
  accent: '#f472b6', // Pink
  background: '#171717', // Dark Grey
  surface: '#262626', // Slightly lighter dark grey
  text: '#FFFFFF', // White
  textSecondary: '#A3A3A3', // Light Grey
  border: '#2F2F2F', // Darker grey
  success: '#10b981', // Green
  warning: '#f59e0b', // Orange
  error: '#ef4444', // Red
  borderRadius: '16px',
  fontFamily: "'Nunito', sans-serif", // Suggesting a child-friendly font
};

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${({ theme }) => theme.fontFamily};
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    align-items: center;
    justify-content: flex-start; /* Align items to the top */
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.primary};
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  a {
    color: ${({ theme }) => theme.secondary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
  }
`;

// Export ThemeProvider for use in App.tsx
export { ThemeProvider };
