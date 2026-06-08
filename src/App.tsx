import styled, { ThemeProvider } from 'styled-components';
import { BookOpen, Calculator, Home, Compass } from 'lucide-react';
import { Button } from './components/Button.tsx';
import { useStore } from './store/store.ts';
import { HomePage } from './pages/HomePage.tsx';
import { MathPage } from './pages/MathPage.tsx';
import { ItalianPage } from './pages/ItalianPage.tsx';
import { GeometryPage } from './pages/GeometryPage.tsx';
import { ThemeSelector } from './components/ThemeSelector.tsx';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.onSurface};
  font-family: 'Nunito', sans-serif;
  padding: 2rem;
  box-sizing: border-box;
  transition: background-color 0.5s ease;
`;

const Header = styled.header`
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  transition: background-color 0.5s ease, border-color 0.5s ease;
  box-sizing: border-box;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.5rem;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: ${({ theme }) => theme.primary};
  margin: 0;
  font-weight: 900;
  letter-spacing: -0.5px;
  transition: color 0.5s ease;
`;

const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

function App() {
  const { currentPage, setCurrentPage, currentTheme } = useStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'math':
        return <MathPage />;
      case 'italian':
        return <ItalianPage />;
      case 'geometry':
        return <GeometryPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <AppContainer>
        <Header>
          <TitleContainer>
            <span style={{ fontSize: '2.5rem' }}>🎒</span>
            <Title>Esercizi Scuola</Title>
          </TitleContainer>
          <NavButtons>
            <Button 
              onClick={() => setCurrentPage('home')} 
              $variant={currentPage === 'home' ? 'filled' : 'outlined'}
              $size="small"
            >
              <Home size={16} /> Home
            </Button>
            <Button 
              onClick={() => setCurrentPage('math')} 
              $variant={currentPage === 'math' ? 'filled' : 'outlined'}
              $size="small"
            >
              <Calculator size={16} /> Matematica
            </Button>
            <Button 
              onClick={() => setCurrentPage('italian')} 
              $variant={currentPage === 'italian' ? 'filled' : 'outlined'}
              $size="small"
            >
              <BookOpen size={16} /> Italiano
            </Button>
            <Button 
              onClick={() => setCurrentPage('geometry')} 
              $variant={currentPage === 'geometry' ? 'filled' : 'outlined'}
              $size="small"
            >
              <Compass size={16} /> Geometria
            </Button>
            
            <ThemeSelector />
          </NavButtons>
        </Header>
        {renderPage()}
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
