import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BookOpen, Calculator, Sparkles, Compass } from 'lucide-react';
import { Button } from '../components/Button.tsx';
import { useStore } from '../store/store.ts';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin-top: 1rem;
`;

const HeroCard = styled(motion.div)`
  background: linear-gradient(135deg, ${({ theme }) => theme.surface} 0%, #2d263f 100%);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 3.5rem 2.5rem;
  width: 100%;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.primary}30;
  box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  margin-bottom: 2.5rem;
  box-sizing: border-box;
`;

const GlowEffect = styled.div`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, ${({ theme }) => theme.primary}15 0%, transparent 60%);
  pointer-events: none;
`;

const AppTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 900;
  color: ${({ theme }) => theme.primary};
  margin: 0 0 1rem 0;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-shadow: 0px 4px 12px rgba(0, 0, 0, 0.5);

  @media (max-width: 600px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.onSurfaceVariant};
  max-width: 700px;
  margin: 0 auto 2.5rem auto;
  line-height: 1.6;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  width: 100%;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SubjectCard = styled(motion.div)<{ $color: string }>`
  background: ${({ theme }) => theme.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: ${({ $color }) => $color};
  }
`;

const IconWrapper = styled.div<{ $bg: string; $color: string }>`
  width: 70px;
  height: 70px;
  border-radius: 20px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0 0 0.75rem 0;
  color: ${({ theme }) => theme.onSurface};
`;

const CardDesc = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.onSurfaceVariant};
  margin: 0 0 2rem 0;
  line-height: 1.5;
  flex-grow: 1;
`;

const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const HomePage: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <HomeContainer>
      <HeroCard
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <GlowEffect />
        <AppTitle>
          Esercizi Scuola <Sparkles size={40} />
        </AppTitle>
        <Subtitle>
          Il parco giochi dell'apprendimento! Impara la matematica, l'italiano e la geometria divertendoti con sfide interattive su misura per te.
        </Subtitle>
        <HeroButtons>
          <Button $variant="elevated" onClick={() => setCurrentPage('math')}>
            <Calculator size={20} /> Matematica
          </Button>
          <Button $variant="tonal" onClick={() => setCurrentPage('italian')}>
            <BookOpen size={20} /> Italiano
          </Button>
          <Button $variant="filled" onClick={() => setCurrentPage('geometry')}>
            <Compass size={20} /> Geometria
          </Button>
        </HeroButtons>
      </HeroCard>

      <GridContainer>
        <SubjectCard 
          $color="#D0BCFF"
          whileHover={{ y: -8, boxShadow: "0px 12px 24px rgba(0,0,0,0.3)", borderColor: "#D0BCFF50" }}
          onClick={() => setCurrentPage('math')}
        >
          <IconWrapper $bg="rgba(208, 188, 255, 0.15)" $color="#D0BCFF">
            <Calculator size={36} />
          </IconWrapper>
          <CardTitle>Matematica</CardTitle>
          <CardDesc>
            La Fabbrica dei Numeri! Risolvi operazioni, conta stelline, gioca con i regoli e scopri le frazioni colorate.
          </CardDesc>
          <Button $variant="filled" style={{ width: '100%' }}>
            Gioca Ora
          </Button>
        </SubjectCard>

        <SubjectCard 
          $color="#7FCFFF"
          whileHover={{ y: -8, boxShadow: "0px 12px 24px rgba(0,0,0,0.3)", borderColor: "#7FCFFF50" }}
          onClick={() => setCurrentPage('italian')}
        >
          <IconWrapper $bg="rgba(127, 207, 255, 0.15)" $color="#7FCFFF">
            <BookOpen size={36} />
          </IconWrapper>
          <CardTitle>Italiano</CardTitle>
          <CardDesc>
            Il Cacciatore di Lettere! Completa parole misteriose, impara l'uso dell'H e divertiti con l'analisi grammaticale.
          </CardDesc>
          <Button $variant="tonal" style={{ width: '100%' }}>
            Gioca Ora
          </Button>
        </SubjectCard>

        <SubjectCard 
          $color="#FFB1C8"
          whileHover={{ y: -8, boxShadow: "0px 12px 24px rgba(0,0,0,0.3)", borderColor: "#FFB1C850" }}
          onClick={() => setCurrentPage('geometry')}
        >
          <IconWrapper $bg="rgba(255, 177, 200, 0.15)" $color="#FFB1C8">
            <Compass size={36} />
          </IconWrapper>
          <CardTitle>Geometria</CardTitle>
          <CardDesc>
            Il Regno delle Forme! Esplora figure magiche, conta lati e vertici, scopri gli angoli e calcola perimetri e aree.
          </CardDesc>
          <Button $variant="outlined" style={{ width: '100%' }}>
            Gioca Ora
          </Button>
        </SubjectCard>
      </GridContainer>
    </HomeContainer>
  );
};
